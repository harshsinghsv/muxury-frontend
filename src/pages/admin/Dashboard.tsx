import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { AdminIcon, icons } from "@/components/admin/AdminIcons";
import api from "@/lib/api";
import { format } from "date-fns";
import { Link } from "react-router-dom";

// ─── TYPES ───
interface DashboardStats {
    today: { orders: number; revenue: number };
    thisMonth: { revenue: number };
    pending: number;
    returnRequests: number;
    lowStockProducts: any[];
    recentOrders: any[];
}

// ─── DASHBOARD PAGE COMPONENT ───
export default function DashboardPage() {
    const { data, isLoading, error } = useQuery({
        queryKey: ["adminDashboardStats"],
        queryFn: async () => {
            const response = await api.get("/admin/dashboard");
            return response.data.data as DashboardStats;
        }
    });

    if (isLoading) {
        return (
            <AdminLayout pageTitle="Dashboard">
                <div className="flex items-center justify-center min-h-[50vh]">
                    <div className="w-8 h-8 lg:w-12 lg:h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin"></div>
                </div>
            </AdminLayout>
        );
    }

    if (error) {
        return (
            <AdminLayout pageTitle="Dashboard">
                <div className="flex items-center justify-center min-h-[50vh]">
                    <p className="text-red-500 font-sans">Error loading dashboard data.</p>
                </div>
            </AdminLayout>
        );
    }

    const stats = data || {} as DashboardStats;
    const { today, thisMonth, pending, recentOrders = [] } = stats;

    return (
        <AdminLayout pageTitle="Dashboard">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
                <StatCard
                    title="Revenue (This Month)"
                    value={`₹${(thisMonth?.revenue || 0).toLocaleString("en-IN")}`}
                    trend="+12%"
                    isPositive={true}
                    icon={icons.rupee}
                />
                <StatCard
                    title="Orders (Today)"
                    value={(today?.orders || 0).toString()}
                    trend="+5%"
                    isPositive={true}
                    icon={icons.package}
                />
                <StatCard
                    title="Pending Orders"
                    value={(pending || 0).toString()}
                    trend="-2%"
                    isPositive={false}
                    icon={icons.orders}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Main Chart Area */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-[#EBEBEB]">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-display font-bold text-lg text-charcoal">Revenue Overview</h3>
                        <select className="bg-[#F7F4F0] border-none text-xs font-medium px-3 py-1.5 rounded-lg outline-none cursor-pointer">
                            <option>This Week</option>
                            <option>This Month</option>
                            <option>This Year</option>
                        </select>
                    </div>
                    <div className="h-64 flex items-end justify-between gap-2 pb-2">
                        {[40, 70, 45, 90, 65, 85, 55].map((h, i) => (
                            <div key={i} className="w-full flex flex-col items-center gap-2 group cursor-pointer">
                                <div
                                    className="w-full bg-[#F0EDE8] group-hover:bg-gold rounded-t-sm transition-colors relative"
                                    style={{ height: `${h}%` }}
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-charcoal text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                                        ₹{(h * 1200).toLocaleString('en-IN')}
                                    </div>
                                </div>
                                <span className="text-[10px] font-sans text-muted-foreground">
                                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Categories */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#EBEBEB]">
                    <h3 className="font-display font-bold text-lg text-charcoal mb-4">Top Categories</h3>
                    <div className="flex flex-col gap-4">
                        {[
                            { name: "Dresses", percent: 45, color: "#CA8385" },
                            { name: "Bags", percent: 30, color: "#8B5E5F" },
                            { name: "Shoes", percent: 15, color: "#D1C8C1" },
                            { name: "Accessories", percent: 10, color: "#E0DCD6" },
                        ].map((cat, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-charcoal">{cat.name}</span>
                                    <span className="text-muted-foreground">{cat.percent}%</span>
                                </div>
                                <div className="h-2 w-full bg-[#F7F4F0] rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full"
                                        style={{ width: `${cat.percent}%`, backgroundColor: cat.color }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#EBEBEB] overflow-hidden">
                <div className="px-6 py-5 border-b border-[#EBEBEB] flex items-center justify-between">
                    <h3 className="font-display font-bold text-lg text-charcoal">Recent Orders</h3>
                    <Link to="/admin/orders" className="text-sm font-medium text-gold hover:text-[#8B5E5F] transition-colors">
                        View All
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-[#F7F4F0] font-sans text-muted-foreground text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 font-medium">Order ID</th>
                                <th className="px-6 py-4 font-medium">Customer</th>
                                <th className="px-6 py-4 font-medium">Date</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#EBEBEB]">
                            {recentOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                                        No recent orders found.
                                    </td>
                                </tr>
                            ) : (
                                recentOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-muted/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-charcoal">#{order.orderNumber}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-charcoal">{order.user?.firstName} {order.user?.lastName}</span>
                                                <span className="text-xs text-muted-foreground">{order.user?.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {format(new Date(order.createdAt), "dd MMM yyyy, HH:mm")}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${order.status === 'DELIVERED' ? 'bg-[#EDF5EC] text-[#2F6B2E]' :
                                                    order.status === 'PROCESSING' ? 'bg-[#FFF9E6] text-[#A67C00]' :
                                                        order.status === 'SHIPPED' ? 'bg-[#EBF3FB] text-[#2965A8]' :
                                                            order.status === 'CANCELLED' ? 'bg-[#FAECEC] text-[#A82929]' :
                                                                'bg-gray-100 text-gray-600'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-medium text-charcoal">
                                            ₹{Number(order.totalAmount).toLocaleString('en-IN')}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}

// ─── HELPER COMPONENTS ───
function StatCard({ title, value, trend, isPositive, icon }: any) {
    return (
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#EBEBEB] flex flex-col h-full min-h-[140px]">
            <div className="flex justify-between items-start mb-auto">
                <div>
                    <p className="font-sans text-[13px] text-muted-foreground font-medium mb-1">{title}</p>
                    <h3 className="font-display text-2xl md:text-3xl font-bold text-charcoal tracking-tight">{value}</h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#F7F4F0] flex items-center justify-center text-charcoal">
                    <AdminIcon d={icon} size={20} stroke="#343434" sw={2} />
                </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5">
                <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isPositive ? "bg-[#EDF5EC] text-[#2F6B2E]" : "bg-[#FAECEC] text-[#A82929]"
                        }`}
                >
                    {trend}
                </span>
                <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">vs last month</span>
            </div>
        </div>
    );
}
