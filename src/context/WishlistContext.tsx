import React, { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
import { tokenStorage } from "@/lib/api";
import { syncWishlistWithBackend } from "@/lib/syncHelpers";

interface WishlistState {
    items: string[];
    isSyncing: boolean;
}

type WishlistAction =
    | { type: "ADD_TO_WISHLIST"; payload: string }
    | { type: "REMOVE_FROM_WISHLIST"; payload: string }
    | { type: "CLEAR_WISHLIST" }
    | { type: "HYDRATE"; payload: string[] }
    | { type: "SET_SYNCING"; payload: boolean };

interface WishlistContextType {
    items: string[];
    addToWishlist: (productId: string) => void;
    removeFromWishlist: (productId: string) => void;
    toggleWishlist: (productId: string) => void;
    isInWishlist: (productId: string) => boolean;
    clearWishlist: () => void;
    wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = "radiant-cart-wishlist";

function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
    switch (action.type) {
        case "ADD_TO_WISHLIST":
            if (state.items.includes(action.payload)) {
                return state;
            }
            return { ...state, items: [...state.items, action.payload] };

        case "REMOVE_FROM_WISHLIST":
            return { ...state, items: state.items.filter((id) => id !== action.payload) };

        case "CLEAR_WISHLIST":
            return { ...state, items: [] };

        case "HYDRATE":
            return { ...state, items: action.payload };

        case "SET_SYNCING":
            return { ...state, isSyncing: action.payload };

        default:
            return state;
    }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(wishlistReducer, { items: [], isSyncing: false });

    // Hydrate from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                dispatch({ type: "HYDRATE", payload: parsed });
            }
        } catch (error) {
            console.error("Failed to load wishlist from localStorage:", error);
        }
    }, []);

    // Persist to localStorage on changes
    useEffect(() => {
        try {
            localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(state.items));
        } catch (error) {
            console.error("Failed to save wishlist to localStorage:", error);
        }
    }, [state.items]);

    // Sync wishlist with backend when user is authenticated
    useEffect(() => {
        const performSync = async () => {
            const token = tokenStorage.getAccess();
            if (!token || state.isSyncing) return;

            dispatch({ type: "SET_SYNCING", payload: true });
            try {
                await syncWishlistWithBackend(state.items);
            } finally {
                dispatch({ type: "SET_SYNCING", payload: false });
            }
        };

        // Debounce sync to avoid too many requests
        const syncTimer = setTimeout(performSync, 500);
        return () => clearTimeout(syncTimer);
    }, [state.items, state.isSyncing]);

    const addToWishlist = (productId: string) => {
        dispatch({ type: "ADD_TO_WISHLIST", payload: productId });
    };

    const removeFromWishlist = (productId: string) => {
        dispatch({ type: "REMOVE_FROM_WISHLIST", payload: productId });
    };

    const toggleWishlist = (productId: string) => {
        if (state.items.includes(productId)) {
            removeFromWishlist(productId);
        } else {
            addToWishlist(productId);
        }
    };

    const isInWishlist = (productId: string) => {
        return state.items.includes(productId);
    };

    const clearWishlist = () => {
        dispatch({ type: "CLEAR_WISHLIST" });
    };

    return (
        <WishlistContext.Provider
            value={{
                items: state.items,
                addToWishlist,
                removeFromWishlist,
                toggleWishlist,
                isInWishlist,
                clearWishlist,
                wishlistCount: state.items.length,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error("useWishlist must be used within a WishlistProvider");
    }
    return context;
}
