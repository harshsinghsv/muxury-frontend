import { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";
import { AdminIcon, icons } from "@/components/admin/AdminIcons";

interface ProductFormModalProps {
    product?: any;
    onClose: () => void;
}

export default function ProductFormModal({ product, onClose }: ProductFormModalProps) {
    const queryClient = useQueryClient();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        name: product?.name || "",
        description: product?.description || "",
        price: product?.price?.toString() || "",
        comparePrice: product?.comparePrice?.toString() || "",
        sku: product?.sku || "",
        stock: product?.stock?.toString() || "",
        categoryId: product?.categoryId || "",
        brand: product?.brand || "",
        tags: product?.tags?.join(", ") || "",
        isActive: product?.isActive ?? true,
    });

    const [images, setImages] = useState<string[]>(product?.images || []);
    const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
    const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    // Fetch categories for the dropdown
    const { data: categories = [] } = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const res = await api.get("/categories");
            return res.data.data.categories;
        }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData((prev) => ({ ...prev, [name]: checked }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setNewImageFiles((prev) => [...prev, ...files]);
        }
    };

    const handleRemoveExistingImage = (imagePath: string) => {
        setImages((prev) => prev.filter(img => img !== imagePath));
        setImagesToDelete((prev) => [...prev, imagePath]);
    };

    const handleRemoveNewImage = (index: number) => {
        setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const validateForm = () => {
        if (!formData.name) return "Product Name is required";
        if (!formData.price || isNaN(Number(formData.price))) return "Valid Price is required";
        if (!formData.sku) return "SKU is required";
        if (!formData.stock || isNaN(Number(formData.stock))) return "Valid Stock quantity is required";
        if (!formData.categoryId) return "Category is required";
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const error = validateForm();
        if (error) {
            toast.error(error);
            return;
        }

        setLoading(true);
        try {
            const submitData = new FormData();
            submitData.append("name", formData.name);
            submitData.append("description", formData.description);
            submitData.append("price", formData.price);
            if (formData.comparePrice) submitData.append("comparePrice", formData.comparePrice);
            submitData.append("sku", formData.sku);
            submitData.append("stock", formData.stock);
            submitData.append("categoryId", formData.categoryId);
            if (formData.brand) submitData.append("brand", formData.brand);

            const tagsArray = formData.tags.split(",").map(t => t.trim()).filter(Boolean);
            submitData.append("tags", JSON.stringify(tagsArray));

            submitData.append("isActive", formData.isActive.toString());

            // Append existing images that were kept
            submitData.append("images", JSON.stringify(images));

            // Append new images
            newImageFiles.forEach((file) => {
                submitData.append("images", file);
            });

            if (product) {
                await api.put(`/products/${product.id}`, submitData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                toast.success("Product updated successfully");
            } else {
                await api.post("/products", submitData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                toast.success("Product created successfully");
            }

            queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
            onClose();
        } catch (err: any) {
            console.error(err);
            toast.error(err.response?.data?.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 pb-20 sm:pb-6">
            <div
                className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-4 flex items-center justify-between border-b border-[#EBEBEB] bg-white z-10 sticky top-0">
                    <h2 className="font-display text-xl font-bold text-charcoal">
                        {product ? "Edit Product" : "Add New Product"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted text-charcoal transition-colors"
                    >
                        <AdminIcon d={icons.x} size={20} stroke="#343434" sw={2} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    <form id="product-form" onSubmit={handleSubmit} className="space-y-8">

                        {/* Status Toggle */}
                        <div className="flex items-center justify-between p-4 bg-[#F7F4F0] rounded-xl border border-[#EBEBEB]">
                            <div>
                                <p className="font-medium text-charcoal text-sm">Product Status</p>
                                <p className="text-xs text-muted-foreground mt-0.5">Toggle to hide this product from the store.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleChange}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                            </label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Basic Info */}
                            <div className="space-y-5">
                                <h3 className="text-sm font-bold text-charcoal uppercase tracking-wider mb-2">Basic Info</h3>

                                <div>
                                    <label className="block text-xs font-semibold text-charcoal mb-1.5 uppercase tracking-wider">Product Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 bg-white border border-[#DDD] rounded-xl text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                                        placeholder="e.g. Silk Evening Dress"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-charcoal mb-1.5 uppercase tracking-wider">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={4}
                                        className="w-full px-4 py-2.5 bg-white border border-[#DDD] rounded-xl text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all resize-none"
                                        placeholder="Detailed description..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-charcoal mb-1.5 uppercase tracking-wider">Price (₹) *</label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 bg-white border border-[#DDD] rounded-xl text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-charcoal mb-1.5 uppercase tracking-wider">Compare Rate (₹)</label>
                                        <input
                                            type="number"
                                            name="comparePrice"
                                            value={formData.comparePrice}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 bg-white border border-[#DDD] rounded-xl text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Inventory & Organization */}
                            <div className="space-y-5">
                                <h3 className="text-sm font-bold text-charcoal uppercase tracking-wider mb-2">Inventory & Category</h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-charcoal mb-1.5 uppercase tracking-wider">SKU *</label>
                                        <input
                                            type="text"
                                            name="sku"
                                            value={formData.sku}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 bg-white border border-[#DDD] rounded-xl text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                                            placeholder="MX-001"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-charcoal mb-1.5 uppercase tracking-wider">Stock Qty *</label>
                                        <input
                                            type="number"
                                            name="stock"
                                            value={formData.stock}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 bg-white border border-[#DDD] rounded-xl text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-charcoal mb-1.5 uppercase tracking-wider">Category *</label>
                                    <select
                                        name="categoryId"
                                        value={formData.categoryId}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 bg-white border border-[#DDD] rounded-xl text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map((cat: any) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-charcoal mb-1.5 uppercase tracking-wider">Brand</label>
                                    <input
                                        type="text"
                                        name="brand"
                                        value={formData.brand}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 bg-white border border-[#DDD] rounded-xl text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                                        placeholder="e.g. Muxury"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-charcoal mb-1.5 uppercase tracking-wider">Tags (comma separated)</label>
                                    <input
                                        type="text"
                                        name="tags"
                                        value={formData.tags}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 bg-white border border-[#DDD] rounded-xl text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                                        placeholder="Summer, Elegant, New Arrival"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Images - Full Width */}
                        <div className="pt-4 border-t border-[#EBEBEB]">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-bold text-charcoal uppercase tracking-wider">Media</h3>
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="text-xs font-medium text-gold hover:text-[#8B5E5F] transition-colors"
                                >
                                    + Add Images
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    multiple
                                    accept="image/jpeg, image/png, image/webp"
                                    onChange={handleImageSelect}
                                />
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                {/* Existing Images */}
                                {images.map((imgUrl) => (
                                    <div key={imgUrl} className="aspect-[4/5] bg-[#F7F4F0] rounded-xl relative overflow-hidden group border border-[#EBEBEB]">
                                        <img src={imgUrl} alt="Product" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveExistingImage(imgUrl)}
                                            className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <AdminIcon d={icons.trash} size={14} stroke="#EF4444" sw={2} />
                                        </button>
                                    </div>
                                ))}

                                {/* New Images */}
                                {newImageFiles.map((file, index) => (
                                    <div key={`new-${index}`} className="aspect-[4/5] bg-[#F7F4F0] rounded-xl relative overflow-hidden group border border-[#EBEBEB] shadow-inner">
                                        <img src={URL.createObjectURL(file)} alt="New Product" className="w-full h-full object-cover opacity-80" />
                                        <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-gold text-white text-[9px] font-bold uppercase tracking-wider rounded">New</div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveNewImage(index)}
                                            className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <AdminIcon d={icons.trash} size={14} stroke="#EF4444" sw={2} />
                                        </button>
                                    </div>
                                ))}

                                {images.length === 0 && newImageFiles.length === 0 && (
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="aspect-[4/5] bg-white border-2 border-dashed border-[#DDD] rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-gold hover:bg-[#FDFBF9] transition-all"
                                    >
                                        <AdminIcon d={icons.upload} size={24} stroke="#999" />
                                        <span className="text-xs text-muted-foreground font-medium">Upload Media</span>
                                    </div>
                                )}
                            </div>
                        </div>

                    </form>
                </div>

                {/* Footer Actions */}
                <div className="px-6 py-4 border-t border-[#EBEBEB] bg-white flex justify-end gap-3 sticky bottom-0 z-10">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 border border-[#EBEBEB] bg-white text-charcoal font-medium text-sm rounded-xl hover:bg-muted transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="product-form"
                        disabled={loading}
                        className="px-8 py-2.5 bg-charcoal text-white font-medium text-sm rounded-xl hover:bg-black disabled:opacity-70 transition-colors flex items-center gap-2"
                    >
                        {loading ? (
                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                            <AdminIcon d={icons.check} size={16} stroke="#fff" sw={2.5} />
                        )}
                        {loading ? "Saving..." : "Save Product"}
                    </button>
                </div>
            </div>
        </div>
    );
}
