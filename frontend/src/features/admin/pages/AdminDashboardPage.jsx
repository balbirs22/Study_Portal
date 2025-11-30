import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AppShell from "@/components/layout/AppShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import PageHeader from "@/components/layout/PageHeader";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loader from "@/components/common/Loader";
import ErrorState from "@/components/common/ErrorState";

import { getAllBranches } from "@/api/branchApi";
import { getAllYears } from "@/api/yearApi";
import { getSubjects } from "@/api/subjectApi";
import { BookOpen, GraduationCap, Layers3 } from "lucide-react";

import AdminLayout from "@/features/admin/components/AdminLayout";

function AdminDashboardPage() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    branches: 0,
    years: 0,
    subjects: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Basic auth guard: redirect if not logged in
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login", { replace: true });
    }
  }, [navigate]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError("");

      const [branchesRes, yearsRes, subjectsRes] = await Promise.all([
        getAllBranches(),
        getAllYears(),
        getSubjects({}),
      ]);

      const branches = branchesRes.data || branchesRes;
      const years = yearsRes.data || yearsRes;
      const subjects = subjectsRes.data || subjectsRes;

      setStats({
        branches: Array.isArray(branches) ? branches.length : 0,
        years: Array.isArray(years) ? years.length : 0,
        subjects: Array.isArray(subjects) ? subjects.length : 0,
      });
    } catch (err) {
      console.error("Failed to load admin stats:", err);
      setError("Failed to load dashboard statistics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <AppShell>
      <AdminLayout>
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Admin", href: "/admin/dashboard" },
            { label: "Dashboard" },
          ]}
        />

        <PageHeader
          title="Admin Dashboard"
          subtitle="Overview of branches, years, and subjects in the study portal."
        />

        {loading && (
          <Loader
            fullPage={false}
            label="Loading dashboard..."
          />
        )}

        {!loading && error && (
          <ErrorState
            description={error}
            onRetry={fetchStats}
          />
        )}

        {!loading && !error && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-2">
              {/* Branches */}
              <Card className="rounded-2xl border border-slate-200 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">
                    Branches
                  </CardTitle>
                  <GraduationCap className="h-5 w-5 text-indigo-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold text-slate-900">
                    {stats.branches}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Departments / specializations configured
                  </p>
                </CardContent>
              </Card>

              {/* Years */}
              <Card className="rounded-2xl border border-slate-200 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">
                    Academic Years
                  </CardTitle>
                  <Layers3 className="h-5 w-5 text-emerald-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold text-slate-900">
                    {stats.years}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Year levels available in the portal
                  </p>
                </CardContent>
              </Card>

              {/* Subjects */}
              <Card className="rounded-2xl border border-slate-200 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">
                    Subjects
                  </CardTitle>
                  <BookOpen className="h-5 w-5 text-rose-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold text-slate-900">
                    {stats.subjects}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Total subjects mapped to years and branches
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => navigate("/admin/branches")}
                className="w-full text-left text-xs text-slate-600 underline underline-offset-2 hover:text-slate-900"
              >
                Manage branches →
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/subjects")}
                className="w-full text-left text-xs text-slate-600 underline underline-offset-2 hover:text-slate-900"
              >
                Manage subjects →
              </button>
            </div>
          </>
        )}
      </AdminLayout>
    </AppShell>
  );
}

export default AdminDashboardPage;
