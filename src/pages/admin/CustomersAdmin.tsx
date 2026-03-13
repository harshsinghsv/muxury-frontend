import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { format } from "date-fns";
import { toast } from "sonner";
import AdminLayout from "@/components/admin/AdminLayout";
import { AdminIcon, icons } from "@/components/admin/AdminIcons";

export default function CustomersAdminPage() {
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState("");

    const { data: responseData, isLoading } = useQuery({
        queryKey: ["adminCustomers"],
        queryFn: async () => {
            const response = await api.get("/admin/customers");
            return response.data.data; // { customers: [], pagination: {} }
        }
    });

    const toggleBlockMutation = useMutation({
        mutationFn: async ({ id, isBlocked }: { id: string; isBlocked: boolean }) => {
            await api.put(`/admin/customers/${id}/block`, { isBlocked });
        },
        onSuccess: (data, variables) => {
            toast.success(variables.isBlocked ? "Customer blocked" : "Customer unblocked");
            queryClient.invalidateQueries({ queryKey: ["adminCustomers"] });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to update customer status");
        }
    });

    const handleToggleBlock = (id: string, currentBlockedStatus: boolean) => {
        if (window.confirm(`Are you sure you want to ${currentBlockedStatus ? 'unblock' : 'block'} this customer?`)) {
            toggleBlockMutation.mutate({ id, isBlocked: !currentBlockedStatus });
        }
    };

    const customers = responseData?.customers || [];
    const filteredCustomers = customers.filter((c: any) => {
        const searchLower = searchQuery.toLowerCase();
        return (
            c.email?.toLowerCase().includes(searchLower) ||
            c.firstName?.toLowerCase().includes(searchLower) ||
            c.lastName?.toLowerCase().includes(searchLower) ||
            c.phone?.includes(searchQuery)
        );
    });

    return (
        <AdminLayout pageTitle="Customers">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                <div className="relative w-full sm:w-80">
                    <input
                        type="text"
                        placeholder="Search by name, email, phone..."
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
                </div>
            </div>

            {/* Customers Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#EBEBEB] overflow-hidden">
                {isLoading ? (
                    <div className="flex items-center justify-center p-12">
                        <div className="w-8 h-8 lg:w-12 lg:h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-[#F7F4F0] font-sans text-muted-foreground text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-charcoal">Customer User</th>
                                    <th className="px-6 py-4 font-semibold text-charcoal">Contact Details</th>
                                    <th className="px-6 py-4 font-semibold text-charcoal text-center">Orders Placed</th>
                                    <th className="px-6 py-4 font-semibold text-charcoal">Registered On</th>
                                    <th className="px-6 py-4 font-semibold text-charcoal text-center">Status</th>
                                    <th className="px-6 py-4 font-semibold text-charcoal text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#EBEBEB]">
                                {filteredCustomers.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                                            No customers found matching your criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCustomers.map((customer: any) => (
                                        <tr key={customer.id} className="hover:bg-muted/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold/20 to-gold/40 flex items-center justify-center text-charcoal font-display font-medium">
                                                        {customer.firstName?.[0]}{customer.lastName?.[0]}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-charcoal">{customer.firstName} {customer.lastName}</span>
                                                        {customer.isVerified && (
                                                            <span className="text-[10px] text-green-600 font-bold uppercase tracking-widest">Verified</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-charcoal">{customer.email}</span>
                                                    <span className="text-xs text-muted-foreground">{customer.phone || 'No phone'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center font-medium text-charcoal text-base">
                                                {customer._count?.orders || 0}
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground">
                                                {format(new Date(customer.createdAt), "dd MMM yyyy")}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${customer.isBlocked ? 'bg-[#FAECEC] text-[#A82929]' : 'bg-[#EDF5EC] text-[#2F6B2E]'
                                                    }`}>
                                                    {customer.isBlocked ? 'Blocked' : 'Active'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => handleToggleBlock(customer.id, customer.isBlocked)}
                                                    disabled={toggleBlockMutation.isPending}
                                                    className={`text-xs font-semibold px-3 py-1.5 border rounded-lg transition-colors ${customer.isBlocked
                                                            ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                                                            : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                                                        } disabled:opacity-50`}
                                                >
                                                    {customer.isBlocked ? 'Unblock' : 'Block User'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
