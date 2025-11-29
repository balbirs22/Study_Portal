import { useMemo, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import AppShell from "@/components/layout/AppShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import PageHeader from "@/components/layout/PageHeader";
import SearchBar from "@/components/layout/SearchBar";

import CourseCard from "@/components/course/CourseCard";
import Loader from "@/components/common/Loader";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";

import { useCourses } from "../hooks/useCourses";

function YearCoursesPage() {
  const navigate = useNavigate();
  const { yearId } = useParams();
  const location = useLocation();

  // If you pass state from YearSelectionPage, e.g. navigate("/year/xyz", { state: { yearName: "First Year" }});
  const yearNameFromState = location.state?.yearName;

  const [search, setSearch] = useState("");

  // Right now we only filter by yearId. Later you can add branchId, semester, etc.
  const { courses, loading, error, refetch } = useCourses({ yearId });

  const filteredCourses = useMemo(() => {
    if (!search.trim()) return courses;

    const q = search.toLowerCase();
    return courses.filter((c) => {
      const name = c.name || c.title || "";
      const code = c.code || "";
      return (
        name.toLowerCase().includes(q) ||
        code.toLowerCase().includes(q)
      );
    });
  }, [courses, search]);

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
      <SearchBar
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search courses by name or code..."
      />

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
        <div className="flex flex-col gap-3 mt-2">
          {filteredCourses.map((course, idx) => (
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
          ))}
        </div>
      )}
    </AppShell>
  );
}

export default YearCoursesPage;
