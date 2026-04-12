/**
 * useProducts — MOCK MODE (client demo)
 *
 * To restore real API: delete the MOCK_MODE block and uncomment
 * the original useQuery implementations below.
 */

// ─── MOCK_MODE ────────────────────────────────────────────────────────────────
import { MOCK_PRODUCTS } from "@/data/mock";
import { Product } from "@/data/products";

export function useProducts(filters?: { category?: string; search?: string; isFeatured?: boolean }) {
    let data = [...MOCK_PRODUCTS];

    if (filters?.isFeatured) {
        data = data.filter((p) => p.isFeatured);
    }
    if (filters?.category) {
        data = data.filter((p) => p.category.toLowerCase() === filters.category!.toLowerCase());
    }
    if (filters?.search) {
        const q = filters.search.toLowerCase();
        data = data.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }

    return { data, isLoading: false, error: null };
}

export function useProduct(idOrSlug: string) {
    const product: Product | undefined = MOCK_PRODUCTS.find(
        (p) => p.id === idOrSlug
    );

    return {
        data: product ?? null,
        isLoading: false,
        error: product ? null : new Error("Product not found"),
    };
}

// ─── REAL API (restore when backend is connected) ─────────────────────────────
// import { useQuery } from "@tanstack/react-query";
// import api from "@/lib/api";
// import { Product } from "@/data/products";
//
// const mapProduct = (item: any): Product => ({
//     id: item.id,
//     name: item.name,
//     price: parseFloat(item.price) || 0,
//     originalPrice: item.mrp ? parseFloat(item.mrp) : undefined,
//     images: item.images?.length > 0 ? item.images : ["https://images.unsplash.com/photo-1571908599407-cdb918ed83bf?w=800&q=80"],
//     category: item.category?.name || "Uncategorized",
//     sizes: item.sizes?.length > 0 ? item.sizes : ["XS", "S", "M", "L", "XL"],
//     stock: item.stock || 0,
//     rating: parseFloat(item.averageRating) || 4.5,
//     reviewsCount: item.totalReviews || 0,
//     description: item.description || "",
//     isNew: item.isNew || false,
//     isFeatured: item.isFeatured || false,
// });
//
// export function useProducts(filters?: { category?: string; search?: string; isFeatured?: boolean }) {
//     return useQuery({
//         queryKey: ["products", filters],
//         queryFn: async () => {
//             const { data } = await api.get("/products", { params: filters });
//             return (data.data?.products || []).map(mapProduct) as Product[];
//         },
//     });
// }
//
// export function useProduct(idOrSlug: string) {
//     return useQuery({
//         queryKey: ["product", idOrSlug],
//         queryFn: async () => {
//             try {
//                 const { data } = await api.get(`/products/${idOrSlug}`);
//                 return mapProduct(data.data.product);
//             } catch {
//                 const { data } = await api.get("/products");
//                 const found = data.data.products.find((p: any) => p.id === idOrSlug || p.slug === idOrSlug);
//                 if (!found) throw new Error("Product not found");
//                 return mapProduct(found);
//             }
//         },
//         enabled: !!idOrSlug,
//     });
// }
