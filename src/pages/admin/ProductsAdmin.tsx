import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import AdminLayout from "@/components/admin/AdminLayout";
import { AdminIcon, icons } from "@/components/admin/AdminIcons";
import ProductFormModal from "../../components/admin/ProductFormModal";
import { toast } from "sonner";

export default function ProductsAdminPage() {
    const queryClient = useQueryClient();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const { data, isLoading } = useQuery({
        queryKey: ["adminProducts"],
        queryFn: async () => {
            const response = await api.get("/products");
            return response.data.data.products || [];
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/products/${id}`);
        },
        onSuccess: () => {
            toast.success("Product deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to delete product");
        }
    });

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            deleteMutation.mutate(id);
        }
    };

    const handleEdit = (product: any) => {
        setEditingProduct(product);
        setIsFormOpen(true);
    };

    const handleAdd = () => {
        setEditingProduct(null);
        setIsFormOpen(true);
    };

    const products = data || [];
    const filteredProducts = products.filter((p: any) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AdminLayout pageTitle="Products">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                <div className="relative w-full sm:w-80">
                    <input
                        type="text"
                        placeholder="Search by name, SKU..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#EBEBEB] rounded-xl text-sm outline-none focus:border-gold transition-colors text-charcoal"
                    />
                    <AdminIcon d={icons.search} size={16} stroke="#666" className="absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>

                <div className="flex gap-3 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-[#EBEBEB] rounded-xl text-sm font-medium hover:bg-muted text-charcoal transition-colors">
                        <AdminIcon d={icons.filter} size={16} stroke="#343434" />
                        Filters
                    </button>
                    <button
                        onClick={handleAdd}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-charcoal text-white rounded-xl text-sm font-medium hover:bg-black transition-colors"
                    >
                        <AdminIcon d={icons.plus} size={16} stroke="#fff" />
                        Add Product
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center min-h-[40vh]">
                    <div className="w-8 h-8 lg:w-12 lg:h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product: any) => (
                        <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#EBEBEB] group">
                            <div className="aspect-[4/5] relative bg-[#F7F4F0] overflow-hidden">
                                <img
                                    src={product.images?.[0]?.url || "https://placehold.co/400x500/F7F4F0/343434?text=No+Image"}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />

                                {/* Overlay actions */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                    <button
                                        onClick={() => handleEdit(product)}
                                        className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-charcoal hover:scale-110 transition-transform"
                                        title="Edit"
                                    >
                                        <AdminIcon d={icons.edit} size={18} stroke="#343434" sw={2} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-red-500 hover:scale-110 transition-transform"
                                        title="Delete"
                                    >
                                        <AdminIcon d={icons.trash} size={18} stroke="#EF4444" sw={2} />
                                    </button>
                                </div>

                                {!product.isActive && (
                                    <div className="absolute top-3 left-3 px-2 py-1 bg-charcoal text-white text-[10px] font-bold uppercase tracking-widest rounded-sm">
                                        Draft
                                    </div>
                                )}
                            </div>

                            <div className="p-4">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-display font-bold text-sm text-charcoal truncate pr-2">{product.name}</h4>
                                    <span className="font-medium text-charcoal whitespace-nowrap">₹{product.price.toLocaleString("en-IN")}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs text-muted-foreground">
                                    <span>SKU: {product.sku}</span>
                                    <span className={product.stock <= product.lowStockThreshold ? "text-red-500 font-medium" : ""}>
                                        {product.stock} in stock
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Product Form Modal */}
            {isFormOpen && (
                <ProductFormModal
                    product={editingProduct}
                    onClose={() => setIsFormOpen(false)}
                />
            )}
        </AdminLayout>
    );
}
