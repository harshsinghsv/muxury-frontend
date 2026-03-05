import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function AdminRoute({ children }: { children: JSX.Element }) {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
                <div className="w-8 h-8 md:w-12 md:h-12 border-4 border-charcoal/20 border-t-charcoal rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user || user.role !== "ADMIN") {
        // If not logged in, or not an admin, redirect them out
        return <Navigate to="/admin/login" replace />;
    }

    return children;
}
