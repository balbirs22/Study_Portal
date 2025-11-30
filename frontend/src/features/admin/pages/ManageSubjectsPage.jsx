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
import {
  getSubjects,
  createSubject,
  deleteSubject,
} from "@/api/subjectApi";
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
      const b = branchesRes.data || branchesRes;
      const y = yearsRes.data || yearsRes;
      setBranches(Array.isArray(b) ? b : []);
      setYears(Array.isArray(y) ? y : []);
    } catch (err) {
      console.error("Failed to load branch/year metadata:", err);
    }
  };

  const fetchSubjectsList = async () => {
    try {
      setLoadingList(true);
      setListError("");
      const res = await getSubjects({});
      const data = res.data || res;
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

    if (!subjectName || !subjectCode || !branchId || !yearId) {
      setFormError("Please fill in subject name, code, branch, and year.");
      return;
    }

    try {
      setFormLoading(true);

      await createSubject({
        name: subjectName,
        code: subjectCode,
        branch: branchId,
        year: yearId,
        semester: semester || undefined,
      });

      setSubjectName("");
      setSubjectCode("");
      setSemester("");
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

  const getBranchName = (id) =>
    branches.find((b) => (b._id || b.id) === id)?.name || "-";

  const getYearName = (id) =>
    years.find((y) => (y._id || y.id) === id)?.name || "-";

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
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 items-end"
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
                <Select
                  value={branchId}
                  onValueChange={setBranchId}
                  disabled={formLoading || branches.length === 0}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((b) => (
                      <SelectItem
                        key={b._id || b.id}
                        value={b._id || b.id}
                      >
                        {b.code} — {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label>Year</Label>
                <Select
                  value={yearId}
                  onValueChange={setYearId}
                  disabled={formLoading || years.length === 0}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((y) => (
                      <SelectItem
                        key={y._id || y.id}
                        value={y._id || y.id}
                      >
                        {y.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="semester">Semester (optional)</Label>
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
          <ErrorState
            description={listError}
            onRetry={fetchSubjectsList}
          />
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
                          className="text-rose-500 hover:text-rose-600 hover:bg-rose-50"
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
