// src/routes/AdminRoute.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAdminAuthContext } from "@/context/AdminAuthContext";
import Loader from "@/components/common/Loader";

function AdminRoute() {
  const location = useLocation();
  const { isAuthenticated, loading } = useAdminAuthContext();

  if (loading) {
    // While we’re checking localStorage / auth
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader label="Checking admin access..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
}

export default AdminRoute;
