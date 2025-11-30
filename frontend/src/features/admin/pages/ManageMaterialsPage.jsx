import { useEffect, useRef, useState } from "react";
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

import { getSubjects } from "@/api/subjectApi";
import {
  getMaterials,
  uploadMultipleMaterials,
  deleteMaterial,
} from "@/api/materialApi";
import { Trash2, UploadCloud } from "lucide-react";

import AdminLayout from "@/features/admin/components/AdminLayout";

function ManageMaterialsPage() {
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState("");

  const [materials, setMaterials] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [listError, setListError] = useState("");

  const [uploadError, setUploadError] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);
  const [title, setTitle] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) navigate("/admin/login", { replace: true });
  }, [navigate]);

  const fetchSubjectsList = async () => {
    try {
      const res = await getSubjects({});
      // Backend returns { count, data: [...] }
      const data = res.data?.data || res.data || [];
      setSubjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch subjects:", err);
    }
  };

  const fetchMaterialsList = async () => {
    if (!selectedSubjectId) {
      setMaterials([]);
      return;
    }
    try {
      setLoadingList(true);
      setListError("");
      const res = await getMaterials(selectedSubjectId);
      // Backend returns { count, data: [...] }
      const data = res.data?.data || res.data || [];
      setMaterials(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch materials:", err);
      setListError("Failed to load materials for selected subject.");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchSubjectsList();
  }, []);

  useEffect(() => {
    fetchMaterialsList();
  }, [selectedSubjectId]);

  const handleUpload = async (e) => {
    e.preventDefault();
    setUploadError("");

    if (!selectedSubjectId) {
      setUploadError("Please select a subject first.");
      return;
    }

    const files = fileInputRef.current?.files;
    if (!files || files.length === 0) {
      setUploadError("Please choose at least one file to upload.");
      return;
    }

    try {
      setUploadLoading(true);

      const formData = new FormData();
      formData.append("subjectId", selectedSubjectId);
      if (title) formData.append("title", title);

      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }

      await uploadMultipleMaterials(formData);
      setTitle("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      fetchMaterialsList();
    } catch (err) {
      console.error("Failed to upload materials:", err);
      const msg =
        err?.response?.data?.msg ||
        err?.message ||
        "Failed to upload materials.";
      setUploadError(msg);
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDeleteMaterial = async (materialId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this material?"
    );
    if (!confirmed) return;

    try {
      await deleteMaterial(materialId);
      fetchMaterialsList();
    } catch (err) {
      console.error("Failed to delete material:", err);
      alert("Failed to delete material.");
    }
  };

  const getSubjectLabel = (id) =>
    subjects.find((s) => (s._id || s.id) === id)?.name || "-";

  return (
    <AppShell>
      <AdminLayout>
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Admin", href: "/admin/dashboard" },
            { label: "Manage Materials" },
          ]}
        />

        <PageHeader
          title="Manage Materials"
          subtitle="Upload and manage files for each subject."
        />

        {/* Subject selection + upload form */}
        <Card className="mb-6 rounded-2xl border border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-slate-800">
              Upload Materials
            </CardTitle>
          </CardHeader>
          <CardContent>
            {uploadError && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription className="text-xs">
                  {uploadError}
                </AlertDescription>
              </Alert>
            )}

            <form
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 items-end"
              onSubmit={handleUpload}
            >
              <div className="space-y-1 sm:col-span-2">
                <Label>Subject</Label>
                <Select value={selectedSubjectId} onValueChange={setSelectedSubjectId}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.length > 0 ? (
                      subjects.map((s) => (
                        <SelectItem key={s._id || s.id} value={String(s._id || s.id)}>
                          {s.code} — {s.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-xs text-slate-500">No subjects available</div>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="material-title">
                  Common Title (optional)
                </Label>
                <Input
                  id="material-title"
                  placeholder="Lecture notes, Assignments..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={uploadLoading}
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <Label htmlFor="files">Files</Label>
                <Input
                  id="files"
                  type="file"
                  multiple
                  ref={fileInputRef}
                  disabled={uploadLoading}
                  className="cursor-pointer"
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  You can select multiple files. Supported formats: PDFs,
                  PPTs, etc.
                </p>
              </div>

              <div className="sm:col-span-2 lg:col-span-3">
                <Button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800"
                  disabled={uploadLoading}
                >
                  <UploadCloud className="h-4 w-4" />
                  {uploadLoading ? "Uploading..." : "Upload Materials"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Materials list */}
        {loadingList && (
          <Loader fullPage={false} label="Loading materials..." />
        )}

        {!loadingList && listError && (
          <ErrorState
            description={listError}
            onRetry={fetchMaterialsList}
          />
        )}

        {!loadingList &&
          !listError &&
          (!selectedSubjectId || materials.length === 0) && (
            <EmptyState
              title={
                !selectedSubjectId ? "No subject selected" : "No materials found"
              }
              description={
                !selectedSubjectId
                  ? "Choose a subject to view or upload materials."
                  : "Once materials are uploaded for this subject, they will appear here."
              }
            />
          )}

        {!loadingList &&
          !listError &&
          selectedSubjectId &&
          materials.length > 0 && (
            <Card className="rounded-2xl border border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-semibold text-slate-800">
                  Materials for {getSubjectLabel(selectedSubjectId)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableCaption>
                    List of materials uploaded for the selected subject.
                  </TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>File Type</TableHead>
                      <TableHead>Uploaded On</TableHead>
                      <TableHead className="w-[80px] text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {materials.map((m) => (
                      <TableRow key={m._id || m.id}>
                        <TableCell className="font-medium">
                          {m.title || m.name || "Untitled"}
                        </TableCell>
                        <TableCell>{m.fileType || "-"}</TableCell>
                        <TableCell>
                          {m.createdAt
                            ? new Date(m.createdAt).toLocaleDateString()
                            : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                            onClick={() =>
                              handleDeleteMaterial(m._id || m.id)
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

export default ManageMaterialsPage;
