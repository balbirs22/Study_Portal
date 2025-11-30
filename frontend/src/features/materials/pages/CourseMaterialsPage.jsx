import { useMemo } from "react";
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
    if (!material.rawUrl) return;
    // Download with original filename for proper file type handling
    downloadFile(material.rawUrl, material.fileName || material.title || "download");
  };

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
        <div className="flex flex-col gap-4 mt-3">
          {materials.map((m) => (
            <MaterialRow
              key={m._id || m.id}
              title={m.title || m.name || "Untitled Material"}
              size={formatSize(m.size || m.fileSize)}
              date={formatDate(m.createdAt || m.uploadedAt)}
              type={(m.fileType || "pdf").toLowerCase()}
              onDownload={() => handleDownload(m)}
            />
          ))}
        </div>
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
