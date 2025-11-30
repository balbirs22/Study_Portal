import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

import AppShell from "@/components/layout/AppShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import PageHeader from "@/components/layout/PageHeader";

import { loginAdmin } from "@/api/authApi";
import { Lock, Mail } from "lucide-react";

function AdminLoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // If already logged in, redirect to dashboard
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);

      const res = await loginAdmin({ email, password });
      const { token, user } = res.data || {};

      if (!token) {
        throw new Error("No token returned from server");
      }

      localStorage.setItem("adminToken", token);
      if (user) {
        localStorage.setItem("adminUser", JSON.stringify(user));
      }

      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      console.error("Admin login failed:", err);
      const message =
        err?.response?.data?.msg ||
        err?.message ||
        "Failed to login. Please check your credentials.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Admin Login" }]} />

      <PageHeader
        title="Administrator Access"
        subtitle="Sign in with your admin credentials to manage branches, years, subjects, and materials."
      />

      <div className="mt-4 flex justify-center">
        <Card className="w-full max-w-md rounded-2xl border border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Admin Login</CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Only authorized staff members should use this panel.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription className="text-xs">{error}</AlertDescription>
              </Alert>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Email */}
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    className="pl-9 rounded-xl"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    className="pl-9 rounded-xl"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full rounded-xl bg-slate-900 hover:bg-slate-800"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

export default AdminLoginPage;
