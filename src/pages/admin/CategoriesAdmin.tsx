import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";
import AdminLayout from "@/components/admin/AdminLayout";
import { AdminIcon, icons } from "@/components/admin/AdminIcons";

export default function CategoriesAdminPage() {
    const queryClient = useQueryClient();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any>(null);
    const [formData, setFormData] = useState({ name: "", description: "" });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const { data: categories, isLoading } = useQuery({
        queryKey: ["adminCategories"],
        queryFn: async () => {
            const response = await api.get("/categories");
            return response.data.data.categories || [];
        }
    });

    const saveMutation = useMutation({
        mutationFn: async (data: any) => {
            const submitData = new FormData();
            submitData.append("name", data.name);
            submitData.append("description", data.description);
            if (selectedFile) {
                submitData.append("image", selectedFile);
            }

            if (data.id) {
                await api.put(`/categories/${data.id}`, submitData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
            } else {
                await api.post("/categories", submitData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
            }
        },
        onSuccess: () => {
            toast.success(editingCategory ? "Category updated" : "Category created");
            queryClient.invalidateQueries({ queryKey: ["adminCategories"] });
            closeForm();
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to save category");
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/categories/${id}`);
        },
        onSuccess: () => {
            toast.success("Category deleted");
            queryClient.invalidateQueries({ queryKey: ["adminCategories"] });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to delete category");
        }
    });

    const openAddForm = () => {
        setEditingCategory(null);
        setFormData({ name: "", description: "" });
        setSelectedFile(null);
        setImagePreview(null);
        setIsFormOpen(true);
    };

    const openEditForm = (category: any) => {
        setEditingCategory(category);
        setFormData({ name: category.name, description: category.description || "" });
        setSelectedFile(null);
        setImagePreview(category.image || null);
        setIsFormOpen(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setEditingCategory(null);
        setFormData({ name: "", description: "" });
        setSelectedFile(null);
        setImagePreview(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name) return toast.error("Name is required");
        saveMutation.mutate({ id: editingCategory?.id, ...formData });
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this category? Products linked to it might be affected.")) {
            deleteMutation.mutate(id);
        }
    };

    return (
        <AdminLayout pageTitle="Categories">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                <div className="relative w-full sm:w-80">
                    <input
                        type="text"
                        placeholder="Search categories..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#EBEBEB] rounded-xl text-sm outline-none focus:border-gold transition-colors text-charcoal"
                    />
                    <AdminIcon d={icons.search} size={16} stroke="#666" className="absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>

                <button
                    onClick={openAddForm}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-charcoal text-white rounded-xl text-sm font-medium hover:bg-black transition-colors"
                >
                    <AdminIcon d={icons.plus} size={16} stroke="#fff" />
                    Add Category
                </button>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center min-h-[40vh]">
                    <div className="w-8 h-8 lg:w-12 lg:h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(categories || []).map((category: any) => (
                        <div key={category.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#EBEBEB] group">
                            {category.image ? (
                                <div className="aspect-video w-full bg-[#F7F4F0] overflow-hidden">
                                    <img src={category.image} alt={category.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                </div>
                            ) : (
                                <div className="aspect-video w-full bg-[#F7F4F0] flex items-center justify-center text-charcoal">
                                    <AdminIcon d={icons.categories} size={32} stroke="#8B5E5F" sw={1.5} />
                                </div>
                            )}
                            <div className="p-6">
                                <h3 className="font-display font-bold text-lg text-charcoal mb-1">{category.name}</h3>
                                <p className="text-sm text-muted-foreground mb-6 line-clamp-2 min-h-[40px]">
                                    {category.description || "No description provided."}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-[#EBEBEB]">
                                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openEditForm(category)} className="p-2 bg-muted text-charcoal rounded-lg hover:bg-[#EBEBEB] transition-colors" title="Edit">
                                            <AdminIcon d={icons.edit} size={14} stroke="#343434" sw={2} />
                                        </button>
                                        <button onClick={() => handleDelete(category.id)} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors" title="Delete">
                                            <AdminIcon d={icons.trash} size={14} stroke="#EF4444" sw={2} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Form Modal */}
            {isFormOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm" onClick={closeForm} />

                    <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-6 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-display font-bold text-xl text-charcoal">
                                {editingCategory ? "Edit Category" : "New Category"}
                            </h2>
                            <button onClick={closeForm} className="p-1 rounded-full hover:bg-muted text-charcoal transition-colors">
                                <AdminIcon d={icons.x} size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Image Upload */}
                            <div>
                                <label className="block text-xs font-semibold text-charcoal mb-1.5 uppercase tracking-wider">Category Image</label>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="aspect-video w-full rounded-xl bg-[#F7F4F0] border-2 border-dashed border-[#DDD] hover:border-gold transition-colors cursor-pointer overflow-hidden flex flex-col items-center justify-center relative group"
                                >
                                    {imagePreview ? (
                                        <>
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <span className="text-white text-xs font-bold uppercase tracking-widest">Change Image</span>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <AdminIcon d={icons.upload} size={24} stroke="#999" />
                                            <span className="text-xs text-muted-foreground font-medium mt-2">Upload Image</span>
                                        </>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="hidden"
                                    accept="image/*"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-charcoal mb-1.5 uppercase tracking-wider">Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-[#FDFBF9] border border-[#DDD] rounded-xl text-sm outline-none focus:border-gold transition-colors"
                                    placeholder="e.g. Watches"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-charcoal mb-1.5 uppercase tracking-wider">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-[#FDFBF9] border border-[#DDD] rounded-xl text-sm outline-none focus:border-gold transition-colors resize-none"
                                    placeholder="Category description..."
                                    rows={3}
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={closeForm} className="flex-1 px-4 py-2.5 bg-muted text-charcoal font-medium rounded-xl hover:bg-[#EBEBEB] transition-colors text-sm">
                                    Cancel
                                </button>
                                <button type="submit" disabled={saveMutation.isPending} className="flex-1 px-4 py-2.5 bg-charcoal text-white font-medium rounded-xl hover:bg-black transition-colors text-sm disabled:opacity-70 flex justify-center items-center">
                                    {saveMutation.isPending ? (
                                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        editingCategory ? "Update" : "Create"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
