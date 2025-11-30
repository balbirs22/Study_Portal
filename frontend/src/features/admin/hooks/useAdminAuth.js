import { useCallback, useEffect, useState } from "react";
import { loginAdmin } from "@/api/authApi";

export function useAdminAuth() {
  const [token, setToken] = useState(null);
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);   // loading initial state
  const [error, setError] = useState(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("adminToken");
      const storedUser = localStorage.getItem("adminUser");

      if (storedToken) {
        setToken(storedToken);
      }
      if (storedUser) {
        setAdminUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error("Failed to read admin auth from localStorage:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const isAuthenticated = !!token;

  const login = useCallback(
    async ({ email, password }) => {
      setError(null);

      if (!email || !password) {
        setError("Please enter both email and password.");
        throw new Error("Missing credentials");
      }

      try {
        setLoading(true);

        const res = await loginAdmin({ email, password });
        const { token: newToken, user } = res.data || {};

        if (!newToken) {
          throw new Error("No token returned from server");
        }

        // Save to state + localStorage
        setToken(newToken);
        setAdminUser(user || null);

        localStorage.setItem("adminToken", newToken);
        if (user) {
          localStorage.setItem("adminUser", JSON.stringify(user));
        } else {
          localStorage.removeItem("adminUser");
        }

        return { token: newToken, user };
      } catch (err) {
        console.error("Admin login failed:", err);
        const msg =
          err?.response?.data?.msg ||
          err?.message ||
          "Failed to login. Please check your credentials.";
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const logout = useCallback(() => {
    try {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
    } catch {
      // ignore
    }
    setToken(null);
    setAdminUser(null);
  }, []);

  return {
    token,
    adminUser,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
  };
}
