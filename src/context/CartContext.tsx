import React, { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
import { Product } from "@/data/products";

export interface CartItem {
    product: Product;
    quantity: number;
    selectedSize: string;
}

interface CartState {
    items: CartItem[];
}

type CartAction =
    | { type: "ADD_TO_CART"; payload: { product: Product; quantity: number; selectedSize: string } }
    | { type: "REMOVE_FROM_CART"; payload: { productId: string; selectedSize: string } }
    | { type: "UPDATE_QUANTITY"; payload: { productId: string; selectedSize: string; quantity: number } }
    | { type: "CLEAR_CART" }
    | { type: "HYDRATE"; payload: CartItem[] };

interface CartContextType {
    items: CartItem[];
    addToCart: (product: Product, quantity: number, selectedSize: string) => void;
    removeFromCart: (productId: string, selectedSize: string) => void;
    updateQuantity: (productId: string, selectedSize: string, quantity: number) => void;
    clearCart: () => void;
    cartCount: number;
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "radiant-cart-items";
const TAX_RATE = 0.1;
const FREE_SHIPPING_THRESHOLD = 100;
const SHIPPING_COST = 15;

function cartReducer(state: CartState, action: CartAction): CartState {
    switch (action.type) {
        case "ADD_TO_CART": {
            const { product, quantity, selectedSize } = action.payload;
            const existingIndex = state.items.findIndex(
                (item) => item.product.id === product.id && item.selectedSize === selectedSize
            );

            if (existingIndex >= 0) {
                const newItems = [...state.items];
                newItems[existingIndex] = {
                    ...newItems[existingIndex],
                    quantity: newItems[existingIndex].quantity + quantity,
                };
                return { items: newItems };
            }

            return {
                items: [...state.items, { product, quantity, selectedSize }],
            };
        }

        case "REMOVE_FROM_CART": {
            return {
                items: state.items.filter(
                    (item) =>
                        !(item.product.id === action.payload.productId && item.selectedSize === action.payload.selectedSize)
                ),
            };
        }

        case "UPDATE_QUANTITY": {
            const { productId, selectedSize, quantity } = action.payload;
            if (quantity <= 0) {
                return {
                    items: state.items.filter(
                        (item) => !(item.product.id === productId && item.selectedSize === selectedSize)
                    ),
                };
            }

            return {
                items: state.items.map((item) =>
                    item.product.id === productId && item.selectedSize === selectedSize
                        ? { ...item, quantity }
                        : item
                ),
            };
        }

        case "CLEAR_CART":
            return { items: [] };

        case "HYDRATE":
            return { items: action.payload };

        default:
            return state;
    }
}

export function CartProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(cartReducer, { items: [] });

    // Hydrate from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(CART_STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                dispatch({ type: "HYDRATE", payload: parsed });
            }
        } catch (error) {
            console.error("Failed to load cart from localStorage:", error);
        }
    }, []);

    // Persist to localStorage on changes
    useEffect(() => {
        try {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
        } catch (error) {
            console.error("Failed to save cart to localStorage:", error);
        }
    }, [state.items]);

    const addToCart = (product: Product, quantity: number, selectedSize: string) => {
        dispatch({ type: "ADD_TO_CART", payload: { product, quantity, selectedSize } });
    };

    const removeFromCart = (productId: string, selectedSize: string) => {
        dispatch({ type: "REMOVE_FROM_CART", payload: { productId, selectedSize } });
    };

    const updateQuantity = (productId: string, selectedSize: string, quantity: number) => {
        dispatch({ type: "UPDATE_QUANTITY", payload: { productId, selectedSize, quantity } });
    };

    const clearCart = () => {
        dispatch({ type: "CLEAR_CART" });
    };

    const cartCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = state.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const tax = subtotal * TAX_RATE;
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const total = subtotal + tax + shipping;

    return (
        <CartContext.Provider
            value={{
                items: state.items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                cartCount,
                subtotal,
                tax,
                shipping,
                total,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
