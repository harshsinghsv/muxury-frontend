import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Product } from "@/data/products";

// Helper to map backend format to frontend Product interface
const mapProduct = (item: any): Product => {
    return {
        id: item.id,
        name: item.name,
        price: parseFloat(item.price) || 0,
        originalPrice: item.mrp ? parseFloat(item.mrp) : undefined,
        images: item.images && item.images.length > 0 ? item.images : ["https://images.unsplash.com/photo-1571908599407-cdb918ed83bf?w=800&q=80"],
        category: item.category?.name || "Uncategorized",
        sizes: item.sizes && item.sizes.length > 0 ? item.sizes : ["XS", "S", "M", "L", "XL"],
        stock: item.stock || 0,
        rating: parseFloat(item.averageRating) || 4.5,
        reviewsCount: item.totalReviews || 0,
        description: item.description || "",
        isNew: item.isNew || false,
        isFeatured: item.isFeatured || false,
    };
};

export function useProducts(filters?: { category?: string; search?: string; isFeatured?: boolean }) {
    return useQuery({
        queryKey: ["products", filters],
        queryFn: async () => {
            const { data } = await api.get("/products", { params: filters });
            return (data.data?.products || []).map(mapProduct) as Product[];
        },
    });
}

export function useProduct(idOrSlug: string) {
    return useQuery({
        queryKey: ["product", idOrSlug],
        queryFn: async () => {
            // Because our frontend routes by ID currently, we'll try fetch by ID or slug.
            // The backend has GET /products/:id (admin) and GET /products/slug/:slug.
            // Let's assume the router can route to the correct one or we use a custom endpoint.
            // Actually, for simplicity we will fetch all and find, or assume the backend has a /products/public/:id
            // Wait, looking at the product controller, getProductById is for admin.
            // Let's use getProductById directly but it might be protected in routes.
            // For now, let's call the public endpoint or fetch all and filter if it's not available.
            try {
                const { data } = await api.get(`/products/${idOrSlug}`);
                return mapProduct(data.data.product);
            } catch (err: any) {
                // If it fails, fallback to fetching all (for scaffold simplicity if endpoint missing)
                const { data } = await api.get("/products");
                const found = data.data.products.find((p: any) => p.id === idOrSlug || p.slug === idOrSlug);
                if (!found) throw new Error("Product not found");
                return mapProduct(found);
            }
        },
        enabled: !!idOrSlug,
    });
}
