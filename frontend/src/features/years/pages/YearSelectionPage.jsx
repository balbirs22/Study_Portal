import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import AppShell from "@/components/layout/AppShell";
import { ArrowRight, BookMarked, FolderOpen, Search, Sparkles, Video } from "lucide-react";

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
    navigate(`/year/${year._id || year.id}`, { state: { yearName: year.label } });
  };

  return (
    <AppShell>
      <section className="relative overflow-hidden rounded-[36px] bg-[#173f2d] px-6 py-14 text-white sm:px-10 lg:px-14 lg:py-20">
        <div className="absolute -right-16 -top-28 h-72 w-72 rounded-full border-[52px] border-white/5" />
        <div className="relative max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-[#d9efdf]"><Sparkles className="h-3.5 w-3.5" />Made for your campus</div>
          <h1 className="text-4xl font-black leading-[1.05] tracking-[-.04em] sm:text-6xl">Everything you need to study, in one calm place.</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[#cfe2d5] sm:text-lg">Find reliable notes, PYQs, video lessons and shared Drive folders—organised by year and subject so you can spend less time searching.</p>
          <div className="mt-8 flex max-w-2xl items-center gap-3 rounded-2xl bg-white p-2 shadow-2xl shadow-black/20">
            <Search className="ml-3 h-5 w-5 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search an academic year…" className="min-w-0 flex-1 bg-transparent px-1 py-3 text-sm text-slate-800 outline-none sm:text-base" />
            <a href="#browse" className="hidden items-center gap-2 rounded-xl bg-[#efb54a] px-5 py-3 text-sm font-bold text-[#34230a] sm:flex">Browse library <ArrowRight className="h-4 w-4" /></a>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Feature icon={<BookMarked className="h-5 w-5" />} title="Notes & PYQs" copy="Exam-ready resources" />
        <Feature icon={<Video className="h-5 w-5" />} title="Video lessons" copy="Learn at your pace" />
        <Feature icon={<FolderOpen className="h-5 w-5" />} title="Drive folders" copy="Curated collections" />
      </section>

      <section id="browse" className="scroll-mt-28 pt-4">
        <p className="text-xs font-black uppercase tracking-[.2em] text-[#2e7753]">Browse the library</p>
        <div className="mt-2 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><h2 className="text-3xl font-black tracking-tight text-[#17201b]">Choose your academic year</h2><p className="mt-2 text-slate-500">Start here, then narrow down by branch and semester.</p></div><p className="text-sm font-semibold text-slate-500">{filteredYears.length} years available</p></div>
      </section>

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
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
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

function Feature({ icon, title, copy }) {
  return <div className="flex items-center gap-4 rounded-2xl border border-[#dfe5de] bg-white px-5 py-4"><div className="rounded-xl bg-[#e7f1ea] p-2.5 text-[#184d36]">{icon}</div><div><p className="font-bold text-[#26342c]">{title}</p><p className="text-xs text-slate-500">{copy}</p></div></div>;
}

export default YearSelectionPage;
