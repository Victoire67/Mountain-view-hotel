// src/components/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute() {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen grid place-items-center bg-ink">
                <div className="h-10 w-10 rounded-full border-2 border-gold/20 border-t-gold animate-spin" />
            </div>
        );
    }

    if (!user) {
        // Remember where the user was going so login can send them back
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }

    return <Outlet />;
}
