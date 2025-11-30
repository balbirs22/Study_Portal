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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import Loader from "@/components/common/Loader";
import ErrorState from "@/components/common/ErrorState";
import EmptyState from "@/components/common/EmptyState";

import { getAllBranches } from "@/api/branchApi";
import { getAllYears } from "@/api/yearApi";
import { getSubjects, createSubject, deleteSubject } from "@/api/subjectApi";
import { Trash2 } from "lucide-react";

import AdminLayout from "@/features/admin/components/AdminLayout";

function ManageSubjectsPage() {
  const navigate = useNavigate();

  const [branches, setBranches] = useState([]);
  const [years, setYears] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [loadingList, setLoadingList] = useState(false);
  const [listError, setListError] = useState("");

  const [branchId, setBranchId] = useState("");
  const [yearId, setYearId] = useState("");
  const [semester, setSemester] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");

  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) navigate("/admin/login", { replace: true });
  }, [navigate]);

  const fetchMeta = async () => {
    try {
      const [branchesRes, yearsRes] = await Promise.all([
        getAllBranches(),
        getAllYears(),
      ]);

      // Backend returns { count, data: [...] }
      const rawBranches = branchesRes.data?.data || branchesRes.data || [];
      const rawYears = yearsRes.data?.data || yearsRes.data || [];

      // branches: keep Mongo _id (backend expects this)
      const b = Array.isArray(rawBranches)
        ? rawBranches.map((br) => ({
            id: String(br._id || br.id),
            code: br.code,
            name: br.name,
          }))
        : [];

      // years: use Year _id as id, but nice label for UI
      const y = Array.isArray(rawYears)
        ? rawYears.map((yr) => {
            const id = String(yr._id || yr.id);
            const order =
              yr.order != null
                ? yr.order
                : yr.value != null
                ? yr.value
                : yr.yearNumber != null
                ? yr.yearNumber
                : yr.year;

            let label = yr.label;
            if (!label) {
              if (order === 1) label = "1st Year";
              else if (order === 2) label = "2nd Year";
              else if (order === 3) label = "3rd Year";
              else if (order === 4) label = "4th Year";
              else label = `Year ${order || ""}`.trim();
            }

            return { id, label, order };
          })
        : [];

      setBranches(b);
      setYears(y);
    } catch (err) {
      console.error("Failed to load branch/year metadata:", err);
    }
  };

  const fetchSubjectsList = async () => {
    try {
      setLoadingList(true);
      setListError("");
      const res = await getSubjects({});
      // Backend returns { count, data: [...] }
      const data = res.data?.data || res.data || [];
      setSubjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load subjects:", err);
      setListError("Failed to load subjects.");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchMeta();
    fetchSubjectsList();
  }, []);

  const handleCreateSubject = async (e) => {
    e.preventDefault();
    setFormError("");

    // backend requires ALL of these (see controller)
    if (!subjectName || !subjectCode || !branchId || !yearId || !semester) {
      setFormError("All fields are required");
      return;
    }

    try {
      setFormLoading(true);

      await createSubject({
        // MUST match controller: { name, code, branchId, yearId, semester }
        name: subjectName,
        code: subjectCode,
        branchId,
        yearId,
        semester,
      });

      setSubjectName("");
      setSubjectCode("");
      setSemester("");
      setBranchId("");
      setYearId("");

      fetchSubjectsList();
    } catch (err) {
      console.error("Failed to create subject:", err);
      const msg =
        err?.response?.data?.msg ||
        err?.message ||
        "Failed to create subject.";
      setFormError(msg);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteSubject = async (subjectId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this subject?"
    );
    if (!confirmed) return;

    try {
      await deleteSubject(subjectId);
      fetchSubjectsList();
    } catch (err) {
      console.error("Failed to delete subject:", err);
      alert("Failed to delete subject.");
    }
  };

  const getBranchName = (branch) => {
    if (!branch) return "-";
    if (typeof branch === "object" && branch.name) return branch.name;
    const found = branches.find((b) => b.id === String(branch));
    return found?.name || "-";
  };

  const getYearName = (year) => {
    if (!year) return "-";
    if (typeof year === "object" && (year.label || year.order)) {
      return year.label || `Year ${year.order || ""}`;
    }
    const found = years.find((y) => y.id === String(year));
    return found?.label || "-";
  };

  return (
    <AppShell>
      <AdminLayout>
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Admin", href: "/admin/dashboard" },
            { label: "Manage Subjects" },
          ]}
        />

        <PageHeader
          title="Manage Subjects"
          subtitle="Map subjects to branches and academic years."
        />

        {/* Create form */}
        <Card className="mb-6 rounded-2xl border border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-slate-800">
              Add New Subject
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
              className="grid items-end gap-4 sm:grid-cols-2 lg:grid-cols-3"
              onSubmit={handleCreateSubject}
            >
              <div className="space-y-1">
                <Label htmlFor="subject-name">Subject Name</Label>
                <Input
                  id="subject-name"
                  placeholder="Engineering Mathematics I"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  disabled={formLoading}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="subject-code">Subject Code</Label>
                <Input
                  id="subject-code"
                  placeholder="MATH101"
                  value={subjectCode}
                  onChange={(e) => setSubjectCode(e.target.value)}
                  disabled={formLoading}
                />
              </div>

              <div className="space-y-1">
                <Label>Branch</Label>
                <Select value={branchId} onValueChange={setBranchId}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.length > 0 ? (
                      branches.map((b) => (
                        <SelectItem key={b.id} value={String(b.id)}>
                          {b.code} — {b.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-xs text-slate-500">No branches available</div>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label>Year</Label>
                <Select value={yearId} onValueChange={setYearId}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.length > 0 ? (
                      years.map((y) => (
                        <SelectItem key={y.id} value={String(y.id)}>
                          {y.label}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-xs text-slate-500">No years available</div>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="semester">Semester</Label>
                <Input
                  id="semester"
                  placeholder="1, 2, 3..."
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  disabled={formLoading}
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-3">
                <Button
                  type="submit"
                  className="rounded-xl bg-slate-900 hover:bg-slate-800"
                  disabled={formLoading}
                >
                  {formLoading ? "Adding..." : "Add Subject"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Subjects list */}
        {loadingList && (
          <Loader fullPage={false} label="Loading subjects..." />
        )}

        {!loadingList && listError && (
          <ErrorState description={listError} onRetry={fetchSubjectsList} />
        )}

        {!loadingList && !listError && subjects.length === 0 && (
          <EmptyState
            title="No subjects found"
            description="Add subjects to link them with branches and years."
          />
        )}

        {!loadingList && !listError && subjects.length > 0 && (
          <Card className="rounded-2xl border border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-slate-800">
                Existing Subjects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>
                  List of subjects configured in the portal.
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Semester</TableHead>
                    <TableHead className="w-[80px] text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subjects.map((s) => (
                    <TableRow key={s._id || s.id}>
                      <TableCell className="font-medium">
                        {s.code}
                      </TableCell>
                      <TableCell>{s.name}</TableCell>
                      <TableCell>{getBranchName(s.branch)}</TableCell>
                      <TableCell>{getYearName(s.year)}</TableCell>
                      <TableCell>{s.semester ?? "-"}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-rose-500 hover:bg-rose-50 hover:text-rose-600"
                          onClick={() =>
                            handleDeleteSubject(s._id || s.id)
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

export default ManageSubjectsPage;
