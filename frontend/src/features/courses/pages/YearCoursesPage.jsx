import { useMemo, useState } from "react";
import { useNavigate, useParams, useLocation, useSearchParams } from "react-router-dom";

import AppShell from "@/components/layout/AppShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import PageHeader from "@/components/layout/PageHeader";
import PortalSearch from "@/components/search/PortalSearch";

import CourseCard from "@/components/course/CourseCard";
import Loader from "@/components/common/Loader";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";

import { useCourses } from "../hooks/useCourses";

function YearCoursesPage() {
  const navigate = useNavigate();
  const { yearId } = useParams();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // If you pass state from YearSelectionPage, e.g. navigate("/year/xyz", { state: { yearName: "First Year" }});
  const yearNameFromState = location.state?.yearName;

  const [search, setSearch] = useState("");
  const [branch, setBranch] = useState(() => searchParams.get("branch") || "all");
  const [semester, setSemester] = useState("all");

  // Filter courses by yearId from URL params
  const { courses, loading, error, refetch } = useCourses({ 
    yearId: yearId || null
  });

  const filteredCourses = useMemo(() => {
    const q = search.toLowerCase();
    return courses.filter((c) => {
      const name = c.name || c.title || "";
      const code = c.code || "";
      const matchesSearch = !search.trim() || (
        name.toLowerCase().includes(q) ||
        code.toLowerCase().includes(q)
      );
      const branchId = c.branch?._id || c.branch;
      const matchesBranch = branch === "all" || String(branchId) === branch;
      const matchesSemester = semester === "all" || String(c.semester) === semester;
      return matchesSearch && matchesBranch && matchesSemester;
    });
  }, [courses, search, branch, semester]);
  const branches = useMemo(() => Array.from(new Map(courses.filter((c) => c.branch).map((c) => [String(c.branch?._id || c.branch), c.branch?.name || c.branch?.code || "Branch"]))).map(([id, name]) => ({ id, name })), [courses]);
  const semesters = useMemo(() => [...new Set(courses.map((c) => c.semester).filter(Boolean))].sort(), [courses]);

  const handleCourseClick = (course) => {
    // Navigate to materials page for this course
    // Example route: /course/:courseId
    navigate(`/course/${course._id || course.id}`, {
      state: {
        courseName: course.name || course.title,
        courseCode: course.code,
        yearName: yearNameFromState,
      },
    });
  };

  // Derive a readable year label
  const yearLabel =
    yearNameFromState ||
    `Year ${yearId || ""}`.trim() ||
    "Selected Year";

  return (
    <AppShell>
      {/* Breadcrumbs: Home / Year */}
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: yearLabel },
        ]}
      />

      {/* Search bar */}
      <PortalSearch
        className="mx-auto mb-8 max-w-2xl"
        onQueryChange={setSearch}
        placeholder="Search any year, branch, subject or course code…"
      />
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setBranch("all")} className={`rounded-full px-4 py-2 text-xs font-bold ${branch === "all" ? "bg-[#184d36] text-white" : "border bg-white text-slate-600"}`}>All branches</button>
        {branches.map((b) => <button key={b.id} onClick={() => setBranch(b.id)} className={`rounded-full px-4 py-2 text-xs font-bold ${branch === b.id ? "bg-[#184d36] text-white" : "border bg-white text-slate-600"}`}>{b.name}</button>)}
        {semesters.length > 1 && <select value={semester} onChange={(e) => setSemester(e.target.value)} className="rounded-full border bg-white px-4 py-2 text-xs font-bold text-slate-600 outline-none"><option value="all">All semesters</option>{semesters.map((s) => <option key={s} value={s}>Semester {s}</option>)}</select>}
      </div>

      {/* Page header */}
      <PageHeader
        title={`${yearLabel} Courses`}
        subtitle="Select a course to access detailed study materials."
      />

      {/* Loading state */}
      {loading && (
        <Loader
          fullPage={false}
          label="Loading courses for this year..."
        />
      )}

      {/* Error state */}
      {!loading && error && (
        <ErrorState
          description={error}
          onRetry={refetch}
        />
      )}

      {/* Empty state */}
      {!loading && !error && filteredCourses.length === 0 && (
        <EmptyState
          title="No courses found"
          description="Once courses are added for this year, they will appear here."
        />
      )}

      {/* Courses list */}
      {!loading && !error && filteredCourses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
          {filteredCourses.map((course, idx) => {
            const card = (
              <CourseCard
                key={course._id || course.id || idx}
                code={course.code || `COURSE-${idx + 1}`}
                title={course.name || course.title || "Untitled Course"}
                fileCount={
                  course.materialCount ??
                  course.materialsCount ??
                  course.totalFiles ??
                  0
                }
                hasPdf={true} // later you can derive this from course metadata
                hasVideo={true}
                onClick={() => handleCourseClick(course)}
              />
            );
            return (
              <div key={course._id || course.id || idx} className="h-full">
                {card}
              </div>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}

export default YearCoursesPage;
