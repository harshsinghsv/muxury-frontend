import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export interface OrderSummary {
    id: string;
    date: string;
    status: string;
    total: number;
    items: number;
    raw: any;
}

export function useOrders() {
    return useQuery<OrderSummary[]>({
        queryKey: ["my-orders"],
        queryFn: async () => {
            const { data } = await api.get("/orders/my-orders");
            if (!data.data || !data.data.orders) return [];

            return data.data.orders.map((o: any) => ({
                id: o.orderNumber,
                date: o.createdAt,
                status: o.status,
                total: parseFloat(o.totalAmount) || 0,
                items: Array.isArray(o.items) ? o.items.reduce((sum: number, i: any) => sum + (i.quantity || 1), 0) : 0,
                raw: o
            }));
        }
    });
}
