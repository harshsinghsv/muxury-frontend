import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { format } from "date-fns";
import { toast } from "sonner";
import AdminLayout from "@/components/admin/AdminLayout";
import { AdminIcon, icons } from "@/components/admin/AdminIcons";

export default function OrdersAdminPage() {
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const { data, isLoading } = useQuery({
        queryKey: ["adminOrders"],
        queryFn: async () => {
            const response = await api.get("/orders");
            return response.data.data.orders || [];
        }
    });

    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, status }: { id: string; status: string }) => {
            await api.put(`/orders/${id}/status`, { status });
        },
        onMutate: ({ id }) => {
            setUpdatingId(id);
        },
        onSuccess: () => {
            toast.success("Order status updated");
            queryClient.invalidateQueries({ queryKey: ["adminOrders"] });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to update status");
        },
        onSettled: () => {
            setUpdatingId(null);
        }
    });

    const handleStatusChange = (id: string, newStatus: string) => {
        updateStatusMutation.mutate({ id, status: newStatus });
    };

    const orders = data || [];
    const filteredOrders = orders.filter((o: any) => {
        const matchesSearch = o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.user?.firstName?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "ALL" || o.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <AdminLayout pageTitle="Orders">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                <div className="relative w-full sm:w-80">
                    <input
                        type="text"
                        placeholder="Search Order ID, Customer..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#EBEBEB] rounded-xl text-sm outline-none focus:border-gold transition-colors text-charcoal"
                    />
                    <AdminIcon d={icons.search} size={16} stroke="#666" className="absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>

                <div className="flex gap-3 w-full sm:w-auto">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full sm:w-auto px-4 py-2.5 bg-white border border-[#EBEBEB] rounded-xl text-sm font-medium outline-none focus:border-gold text-charcoal transition-colors cursor-pointer appearance-none"
                    >
                        <option value="ALL">All Statuses</option>
                        <option value="PENDING">Pending</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                        <option value="RETURN_REQUESTED">Return Requested</option>
                    </select>
                </div>
            </div>

            {/* Orders Table */}
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
                                    <th className="px-6 py-4 font-semibold text-charcoal">Order ID</th>
                                    <th className="px-6 py-4 font-semibold text-charcoal">Customer</th>
                                    <th className="px-6 py-4 font-semibold text-charcoal">Date</th>
                                    <th className="px-6 py-4 font-semibold text-charcoal">Payment</th>
                                    <th className="px-6 py-4 font-semibold text-charcoal text-right">Amount</th>
                                    <th className="px-6 py-4 font-semibold text-charcoal text-center">Status</th>
                                    <th className="px-6 py-4 font-semibold text-charcoal text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#EBEBEB]">
                                {filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                                            No orders found matching your criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrders.map((order: any) => (
                                        <tr key={order.id} className="hover:bg-muted/50 transition-colors">
                                            <td className="px-6 py-5 font-medium text-charcoal">
                                                #{order.orderNumber}
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-charcoal">{order.user?.firstName} {order.user?.lastName}</span>
                                                    <span className="text-xs text-muted-foreground mt-0.5">{order.user?.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-muted-foreground text-[13px]">
                                                {format(new Date(order.createdAt), "dd MMM yyyy, HH:mm")}
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${order.paymentStatus === 'PAID' ? 'bg-[#EDF5EC] text-[#2F6B2E]' : 'bg-[#FFF9E6] text-[#A67C00]'
                                                    }`}>
                                                    {order.paymentStatus}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-right font-medium text-charcoal">
                                                ₹{Number(order.totalAmount).toLocaleString('en-IN')}
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <span className={`inline-flex items-center justify-center w-28 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${order.status === 'DELIVERED' ? 'bg-[#EDF5EC] text-[#2F6B2E] border border-green-200' :
                                                    order.status === 'PROCESSING' ? 'bg-[#FFF9E6] text-[#A67C00] border border-yellow-200' :
                                                        order.status === 'SHIPPED' ? 'bg-[#EBF3FB] text-[#2965A8] border border-blue-200' :
                                                            order.status === 'CANCELLED' ? 'bg-[#FAECEC] text-[#A82929] border border-red-200' :
                                                                'bg-gray-100 text-gray-600 border border-gray-200'
                                                    }`}>
                                                    {updatingId === order.id ? (
                                                        <span className="flex items-center gap-1.5 justify-center w-full">
                                                            <span className="w-2.5 h-2.5 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                                                            <span className="sr-only">Updating</span>
                                                        </span>
                                                    ) : (
                                                        order.status
                                                    )}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <select
                                                    disabled={updatingId === order.id}
                                                    value={order.status}
                                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                    className="text-xs font-semibold px-2 py-1.5 border border-[#EBEBEB] rounded-lg bg-white outline-none cursor-pointer focus:border-gold hover:border-[#DDD] transition-colors disabled:opacity-50"
                                                >
                                                    <option value="PENDING">Pending</option>
                                                    <option value="PROCESSING">Process</option>
                                                    <option value="SHIPPED">Ship</option>
                                                    <option value="DELIVERED">Deliver</option>
                                                    <option value="CANCELLED">Cancel</option>
                                                </select>
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
