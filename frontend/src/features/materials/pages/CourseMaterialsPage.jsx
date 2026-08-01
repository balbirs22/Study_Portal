import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import AppShell from "@/components/layout/AppShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import PageHeader from "@/components/layout/PageHeader";

import MaterialRow from "@/components/course/MaterialRow";
import Loader from "@/components/common/Loader";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";

import { useMaterials } from "../hooks/useMaterials";
import { downloadFile } from "@/lib/cloudinary";
import { env } from "@/lib/env";

// Simple helpers (you could move to lib/utils later)
const formatSize = (bytesOrString) => {
  if (!bytesOrString && bytesOrString !== 0) return "";
  if (typeof bytesOrString === "string") return bytesOrString;

  const bytes = Number(bytesOrString);
  if (Number.isNaN(bytes)) return "";
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(1)} MB`;
  const gb = mb / 1024;
  return `${gb.toFixed(1)} GB`;
};

const formatDate = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

function CourseMaterialsPage() {
  const { courseId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");

  // Data passed from YearCoursesPage (recommended)
  const courseNameFromState = location.state?.courseName;
  const courseCodeFromState = location.state?.courseCode;
  const yearNameFromState = location.state?.yearName;

  // courseId is the subjectId
  const { materials, loading, error, refetch } = useMaterials({
    subjectId: courseId || null,
  });

  const courseTitle = courseNameFromState || "Selected Course";
  const courseCode = courseCodeFromState || "";

  const breadcrumbs = useMemo(() => {
    const items = [{ label: "Home", href: "/" }];
    if (yearNameFromState) {
      items.push({
        label: yearNameFromState,
        href: location.state?.yearId
          ? `/year/${location.state.yearId}`
          : undefined,
      });
    }
    items.push({ label: courseTitle });
    return items;
  }, [courseTitle, yearNameFromState, location.state]);

  const handleDownload = (material) => {
    const target = material.externalUrl || material.rawUrl || material.fileUrl;
    if (!target) return;
    if (material.externalUrl) { window.open(target, "_blank", "noopener,noreferrer"); return; }
    const materialId = material._id || material.id;
    if (materialId) {
      downloadFile(`${env.API_URL}/public/materials/${encodeURIComponent(materialId)}/download`);
      return;
    }
    downloadFile(target);
  };

  const materialType = (m) => {
    if (m.resourceType && m.resourceType !== "file") return m.resourceType;
    const mime = (m.fileType || "").toLowerCase();
    return mime.includes("video") ? "video" : "pdf";
  };
  const visibleMaterials = materials.filter((m) => filter === "all" || materialType(m) === filter);

  return (
    <AppShell>
      {/* Breadcrumbs: Home / Year / Course */}
      <Breadcrumbs items={breadcrumbs} />

      {/* Page header */}
      <PageHeader
        title={courseTitle}
        subtitle={
          courseCode
            ? `${courseCode} - Download notes, assignments, and resources for this course.`
            : "Download notes, assignments, and resources for this course."
        }
        badge={courseCode || undefined}
      />

      {/* Loading */}
      {loading && (
        <Loader fullPage={false} label="Loading course materials..." />
      )}

      {/* Error */}
      {!loading && error && (
        <ErrorState description={error} onRetry={refetch} />
      )}

      {/* Empty */}
      {!loading && !error && materials.length === 0 && (
        <EmptyState
          title="No materials uploaded yet"
          description="Once your faculty uploads resources for this course, they will be listed here."
        />
      )}

      {/* Materials list */}
      {!loading && !error && materials.length > 0 && (
        <>
        <div className="mb-5 flex flex-wrap gap-2">{["all", "pdf", "video", "drive", "link"].map((type) => <button key={type} onClick={() => setFilter(type)} className={`rounded-full px-4 py-2 text-sm font-bold capitalize transition ${filter === type ? "bg-[#184d36] text-white" : "border border-[#dfe5de] bg-white text-slate-600 hover:border-[#184d36]"}`}>{type === "pdf" ? "Files" : type}</button>)}</div>
        <div className="flex flex-col gap-4 mt-3">
          {visibleMaterials.map((m) => (
            <MaterialRow
              key={m._id || m.id}
              title={m.title || m.name || "Untitled Material"}
              size={formatSize(m.size || m.fileSize)}
              date={formatDate(m.createdAt || m.uploadedAt)}
              type={materialType(m)}
              description={m.description}
              onDownload={() => handleDownload(m)}
            />
          ))}
        </div>
        {visibleMaterials.length === 0 && <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">No resources in this category yet.</p>}
        </>
      )}

      {/* Optional: Back button at bottom */}
      {!loading && (
        <div className="mt-6 text-xs text-slate-500">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="underline underline-offset-2 hover:text-slate-700"
          >
            <span className="text-sm">&lt;</span> Back to courses
          </button>
        </div>
      )}
    </AppShell>
  );
}

export default CourseMaterialsPage;
