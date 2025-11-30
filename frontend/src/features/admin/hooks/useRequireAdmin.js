import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "./useAdminAuth";

/**
 * Simple guard: if not authenticated and not loading,
 * redirects to /admin/login.
 *
 * @param {object} options
 * @param {string} options.redirectTo - path to redirect if unauthenticated
 */
export function useRequireAdmin({ redirectTo = "/admin/login" } = {}) {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAdminAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [loading, isAuthenticated, navigate, redirectTo]);

  return { isAuthenticated, loading };
}
