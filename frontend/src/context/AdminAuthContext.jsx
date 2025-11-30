import { createContext, useContext } from "react";
import { useAdminAuth } from "@/features/admin/hooks/useAdminAuth";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const auth = useAdminAuth(); // { token, adminUser, isAuthenticated, loading, error, login, logout }

  return (
    <AdminAuthContext.Provider value={auth}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuthContext() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error("useAdminAuthContext must be used within AdminAuthProvider");
  }
  return ctx;
}
