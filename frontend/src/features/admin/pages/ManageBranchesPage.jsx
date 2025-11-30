import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AppShell from "@/components/layout/AppShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import PageHeader from "@/components/layout/PageHeader";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Loader from "@/components/common/Loader";
import ErrorState from "@/components/common/ErrorState";
import EmptyState from "@/components/common/EmptyState";

import {
  getAllBranches,
  createBranch,
  deleteBranch,
} from "@/api/branchApi";
import { Trash2 } from "lucide-react";

import AdminLayout from "@/features/admin/components/AdminLayout";

function ManageBranchesPage() {
  const navigate = useNavigate();

  const [branches, setBranches] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [listError, setListError] = useState("");

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  // Guard
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) navigate("/admin/login", { replace: true });
  }, [navigate]);

  const fetchBranches = async () => {
    try {
      setLoadingList(true);
      setListError("");

      const res = await getAllBranches();
      const data = res.data || res;
      setBranches(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch branches:", err);
      setListError("Failed to load branches.");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleCreateBranch = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!name || !code) {
      setFormError("Please enter both branch name and code.");
      return;
    }

    try {
      setFormLoading(true);
      await createBranch({ name, code });
      setName("");
      setCode("");
      fetchBranches();
    } catch (err) {
      console.error("Failed to create branch:", err);
      const msg =
        err?.response?.data?.msg ||
        err?.message ||
        "Failed to create branch.";
      setFormError(msg);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteBranch = async (branchId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this branch?"
    );
    if (!confirmed) return;

    try {
      await deleteBranch(branchId);
      fetchBranches();
    } catch (err) {
      console.error("Failed to delete branch:", err);
      alert("Failed to delete branch.");
    }
  };

  return (
    <AppShell>
      <AdminLayout>
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Admin", href: "/admin/dashboard" },
            { label: "Manage Branches" },
          ]}
        />

        <PageHeader
          title="Manage Branches"
          subtitle="Add or remove branches/departments available in the portal."
        />

        <Card className="mb-6 rounded-2xl border border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-slate-800">
              Add New Branch
            </CardTitle>
          </CardHeader>
          <CardContent>
            {formError && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription className="text-xs">
                  {formError}
                </AlertDescription>
              </Alert>
            )}

            <form
              className="grid gap-4 sm:grid-cols-3 items-end"
              onSubmit={handleCreateBranch}
            >
              <div className="space-y-1 sm:col-span-2">
                <Label htmlFor="branch-name">Branch Name</Label>
                <Input
                  id="branch-name"
                  placeholder="Computer Science, Mechanical..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={formLoading}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="branch-code">Code</Label>
                <Input
                  id="branch-code"
                  placeholder="CSE, ME, ECE..."
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  disabled={formLoading}
                />
              </div>

              <div className="sm:col-span-3">
                <Button
                  type="submit"
                  className="rounded-xl bg-slate-900 hover:bg-slate-800"
                  disabled={formLoading}
                >
                  {formLoading ? "Adding..." : "Add Branch"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {loadingList && (
          <Loader fullPage={false} label="Loading branches..." />
        )}

        {!loadingList && listError && (
          <ErrorState description={listError} onRetry={fetchBranches} />
        )}

        {!loadingList && !listError && branches.length === 0 && (
          <EmptyState
            title="No branches found"
            description="Add branches to get started."
          />
        )}

        {!loadingList && !listError && branches.length > 0 && (
          <Card className="rounded-2xl border border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-slate-800">
                Existing Branches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>
                  List of branches in the portal.
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/4">Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="w-[80px] text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {branches.map((b) => (
                    <TableRow key={b._id || b.id}>
                      <TableCell className="font-medium">
                        {b.code}
                      </TableCell>
                      <TableCell>{b.name}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                          onClick={() =>
                            handleDeleteBranch(b._id || b.id)
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </AdminLayout>
    </AppShell>
  );
}

export default ManageBranchesPage;
