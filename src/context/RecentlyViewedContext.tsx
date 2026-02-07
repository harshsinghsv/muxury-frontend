import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { Product, products, getProductById } from "@/data/products";

interface RecentlyViewedContextType {
    recentlyViewed: Product[];
    addToRecentlyViewed: (productId: string) => void;
    clearRecentlyViewed: () => void;
    getRelatedProducts: (productId: string, limit?: number) => Product[];
    getAlsoBought: (productId: string, limit?: number) => Product[];
    getCompleteTheLook: (productId: string, limit?: number) => Product[];
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

const MAX_RECENT_ITEMS = 12;

// Simulated "also bought" data - in production this comes from user behavior analytics
const alsoBoughtMap: Record<string, string[]> = {
    "1": ["5", "9", "12"],
    "2": ["6", "10", "15"],
    "3": ["7", "11", "4"],
    "4": ["8", "3", "16"],
    "5": ["1", "13", "14"],
};

// Simulated "complete the look" data - complementary items
const completeTheLookMap: Record<string, string[]> = {
    // Dresses pair with bags and accessories
    "1": ["9", "10", "13"],
    "2": ["9", "11", "14"],
    "3": ["10", "12", "15"],
    // Suits pair with accessories
    "5": ["11", "13", "16"],
    "6": ["12", "14", "9"],
    // Bags pair with other accessories
    "9": ["13", "14", "15"],
};

export const RecentlyViewedProvider = ({ children }: { children: ReactNode }) => {
    const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

    // Load from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem("recentlyViewed");
        if (stored) {
            const productIds: string[] = JSON.parse(stored);
            const products = productIds
                .map((id) => getProductById(id))
                .filter((p): p is Product => p !== undefined);
            setRecentlyViewed(products);
        }
    }, []);

    const addToRecentlyViewed = useCallback((productId: string) => {
        const product = getProductById(productId);
        if (!product) return;

        setRecentlyViewed((prev) => {
            // Remove if already exists, add to front
            const filtered = prev.filter((p) => p.id !== productId);
            const updated = [product, ...filtered].slice(0, MAX_RECENT_ITEMS);

            // Persist to localStorage
            localStorage.setItem(
                "recentlyViewed",
                JSON.stringify(updated.map((p) => p.id))
            );

            return updated;
        });
    }, []);

    const clearRecentlyViewed = useCallback(() => {
        setRecentlyViewed([]);
        localStorage.removeItem("recentlyViewed");
    }, []);

    // Get related products based on category
    const getRelatedProducts = useCallback((productId: string, limit = 4): Product[] => {
        const product = getProductById(productId);
        if (!product) return [];

        return products
            .filter((p) => p.id !== productId && p.category === product.category)
            .slice(0, limit);
    }, []);

    // Get "Customers also bought" recommendations
    const getAlsoBought = useCallback((productId: string, limit = 4): Product[] => {
        const alsoBoughtIds = alsoBoughtMap[productId] || [];
        const results = alsoBoughtIds
            .map((id) => getProductById(id))
            .filter((p): p is Product => p !== undefined);

        // If not enough, supplement with random from different category
        if (results.length < limit) {
            const product = getProductById(productId);
            const supplements = products
                .filter((p) =>
                    p.id !== productId &&
                    p.category !== product?.category &&
                    !results.some((r) => r.id === p.id)
                )
                .slice(0, limit - results.length);
            return [...results, ...supplements].slice(0, limit);
        }

        return results.slice(0, limit);
    }, []);

    // Get "Complete the look" recommendations
    const getCompleteTheLook = useCallback((productId: string, limit = 3): Product[] => {
        const complementaryIds = completeTheLookMap[productId] || [];
        const results = complementaryIds
            .map((id) => getProductById(id))
            .filter((p): p is Product => p !== undefined);

        // If not enough, get from accessories or different category
        if (results.length < limit) {
            const product = getProductById(productId);
            const supplements = products
                .filter((p) =>
                    p.id !== productId &&
                    p.category !== product?.category &&
                    !results.some((r) => r.id === p.id)
                )
                .slice(0, limit - results.length);
            return [...results, ...supplements].slice(0, limit);
        }

        return results.slice(0, limit);
    }, []);

    return (
        <RecentlyViewedContext.Provider
            value={{
                recentlyViewed,
                addToRecentlyViewed,
                clearRecentlyViewed,
                getRelatedProducts,
                getAlsoBought,
                getCompleteTheLook,
            }}
        >
            {children}
        </RecentlyViewedContext.Provider>
    );
};

export const useRecentlyViewed = () => {
    const context = useContext(RecentlyViewedContext);
    if (!context) {
        throw new Error("useRecentlyViewed must be used within a RecentlyViewedProvider");
    }
    return context;
};
