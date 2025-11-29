import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import PageHeader from "@/components/layout/PageHeader";
import SearchBar from "@/components/layout/SearchBar";

function App() {
  const [search, setSearch] = useState("");

  return (
    <AppShell>
      <Breadcrumbs items={[{ label: "Home" }, { label: "First Year" }]} />

      <SearchBar
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <PageHeader
        title="First Year Courses"
        subtitle="Select a course to access study materials."
      />

      {/* later: list YearCard / CourseCard etc here */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">
          Your course cards will appear here.
        </p>
      </div>
    </AppShell>
  );
}

export default App;
