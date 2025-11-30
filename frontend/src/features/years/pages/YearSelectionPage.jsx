import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import AppShell from "@/components/layout/AppShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import PageHeader from "@/components/layout/PageHeader";
import SearchBar from "@/components/layout/SearchBar";

import YearCard from "@/components/course/YearCard";
import Loader from "@/components/common/Loader";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";

import { useYears } from "../hooks/useYears";

function YearSelectionPage() {
  const navigate = useNavigate();
  const { years, loading, error, refetch } = useYears();
  const [search, setSearch] = useState("");

  // Filter years by search text (e.g. "First", "Second", "2024")
  const filteredYears = useMemo(() => {
    if (!search.trim()) return years;

    const q = search.toLowerCase();
    return years.filter((y) => {
      const label = y.label || "";
      return label.toLowerCase().includes(q);
    });
  }, [years, search]);

  const handleYearClick = (year) => {
    // You can navigate however your routes are designed.
    // Example: /year/:id
    navigate(`/year/${year._id || year.id}`);
  };

  return (
    <AppShell>
      <div className="space-y-4">
        <Breadcrumbs items={[{ label: "Home" }]} />

        <SearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search courses, materials, topics..."
        />

        <div className="text-center">
          <PageHeader
            title="Select Your Year"
            subtitle="Choose your academic year to access course materials."
          />
        </div>
      </div>

      {/* Loading state */}
      {loading && <Loader fullPage={false} label="Loading academic years..." />}

      {/* Error state */}
      {!loading && error && (
        <ErrorState
          description={error}
          onRetry={refetch}
        />
      )}

      {/* Empty state */}
      {!loading && !error && filteredYears.length === 0 && (
        <EmptyState
          title="No years available"
          description="Once academic years are added by the admin, they will appear here."
        />
      )}

      {/* Grid of YearCards */}
      {!loading && !error && filteredYears.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-2">
          {filteredYears.map((year, idx) => (
            <YearCard
              key={year._id || year.id || idx}
              index={idx}
              title={year.label || `Year ${idx + 1}`}
              courseCount={
                year.courseCount ??
                year.coursesCount ??
                year.totalCourses ??
                0
              }
              onClick={() => handleYearClick(year)}
            />
          ))}
        </div>
      )}
    </AppShell>
  );
}

export default YearSelectionPage;
