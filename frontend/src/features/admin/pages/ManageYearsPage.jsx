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
  getAllYears,
  createYear,
  deleteYear,
} from "@/api/yearApi";
import { Trash2 } from "lucide-react";

import AdminLayout from "@/features/admin/components/AdminLayout";

function ManageYearsPage() {
  const navigate = useNavigate();

  const [years, setYears] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [listError, setListError] = useState("");

  const [label, setLabel] = useState("");
  const [order, setOrder] = useState("");
  const [description, setDescription] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) navigate("/admin/login", { replace: true });
  }, [navigate]);

  const fetchYears = async () => {
    try {
      setLoadingList(true);
      setListError("");

      const res = await getAllYears();
      // Backend returns { count, data: [...] }
      const data = res.data?.data || res.data || [];
      setYears(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch years:", err);
      setListError("Failed to load academic years.");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchYears();
  }, []);

  const handleCreateYear = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!label) {
      setFormError("Please enter a year label.");
      return;
    }
    if (!order) {
      setFormError("Please enter an order.");
      return;
    }

    try {
      setFormLoading(true);
      await createYear({
        label,
        order: Number(order),
        description,
      });
      setLabel("");
      setOrder("");
      setDescription("");
      fetchYears();
    } catch (err) {
      console.error("Failed to create year:", err);
      const msg =
        err?.response?.data?.msg ||
        err?.message ||
        "Failed to create year.";
      setFormError(msg);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteYear = async (yearId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this year? This may affect related subjects."
    );
    if (!confirmed) return;

    try {
      await deleteYear(yearId);
      fetchYears();
    } catch (err) {
      console.error("Failed to delete year:", err);
      alert("Failed to delete year.");
    }
  };

  return (
    <AppShell>
      <AdminLayout>
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Admin", href: "/admin/dashboard" },
            { label: "Manage Years" },
          ]}
        />

        <PageHeader
          title="Manage Academic Years"
          subtitle="Configure academic year levels such as First Year, Second Year, etc."
        />

        <Card className="mb-6 rounded-2xl border border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-slate-800">
              Add New Year
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
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 items-end"
              onSubmit={handleCreateYear}
            >
              <div className="space-y-1">
                <Label htmlFor="year-label">Year Label</Label>
                <Input
                  id="year-label"
                  placeholder="First Year, Second Year..."
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  disabled={formLoading}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="year-order">Order (1-8)</Label>
                <Input
                  id="year-order"
                  type="number"
                  placeholder="1, 2, 3..."
                  min="1"
                  max="8"
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                  disabled={formLoading}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="year-description">Description (optional)</Label>
                <Input
                  id="year-description"
                  placeholder="Description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={formLoading}
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-3">
                <Button
                  type="submit"
                  className="rounded-xl bg-slate-900 hover:bg-slate-800"
                  disabled={formLoading}
                >
                  {formLoading ? "Adding..." : "Add Year"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {loadingList && (
          <Loader fullPage={false} label="Loading years..." />
        )}

        {!loadingList && listError && (
          <ErrorState description={listError} onRetry={fetchYears} />
        )}

        {!loadingList && !listError && years.length === 0 && (
          <EmptyState
            title="No years found"
            description="Add academic years to structure your courses."
          />
        )}

        {!loadingList && !listError && years.length > 0 && (
          <Card className="rounded-2xl border border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-slate-800">
                Existing Years
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>
                  List of academic years configured.
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead className="w-[80px] text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {years.map((y) => (
                    <TableRow key={y._id || y.id}>
                      <TableCell className="font-medium">
                        {y.label || "Untitled"}
                      </TableCell>
                      <TableCell>{y.order ?? "-"}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                          onClick={() =>
                            handleDeleteYear(y._id || y.id)
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

export default ManageYearsPage;
