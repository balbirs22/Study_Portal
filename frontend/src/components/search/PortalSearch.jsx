import { useEffect, useMemo, useRef, useState } from "react";
import { BookOpen, Building2, GraduationCap, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getAllBranches } from "@/api/branchApi";
import { getSubjects } from "@/api/subjectApi";
import { getAllYears } from "@/api/yearApi";

const ordinalAliases = {
  1: "first 1st one",
  2: "second 2nd two",
  3: "third 3rd three",
  4: "fourth 4th four",
};

const responseData = (response) => {
  const data = response?.data?.data || response?.data || [];
  return Array.isArray(data) ? data : [];
};

function PortalSearch({
  className = "",
  placeholder = "Search years, branches or subjects…",
  onQueryChange,
}) {
  const navigate = useNavigate();
  const rootRef = useRef(null);
  const [query, setQuery] = useState("");
  const [catalogue, setCatalogue] = useState({ years: [], branches: [], subjects: [] });
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    let active = true;
    Promise.all([getAllYears(), getAllBranches(), getSubjects({})])
      .then(([years, branches, subjects]) => {
        if (active) {
          setCatalogue({
            years: responseData(years),
            branches: responseData(branches),
            subjects: responseData(subjects),
          });
        }
      })
      .catch((error) => console.error("Failed to load search catalogue:", error));
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const years = catalogue.years.map((year) => ({
      id: `year-${year._id || year.id}`,
      type: "Year",
      title: year.label,
      detail: `${year.courseCount || 0} subjects available`,
      icon: GraduationCap,
      searchable: `${year.label} year ${ordinalAliases[year.order] || ""}`,
      to: `/year/${year._id || year.id}`,
      state: { yearName: year.label },
    }));

    const subjects = catalogue.subjects.map((subject) => ({
      id: `subject-${subject._id || subject.id}`,
      type: "Subject",
      title: subject.name,
      detail: [subject.code, subject.branch?.name, subject.year?.label].filter(Boolean).join(" · "),
      icon: BookOpen,
      searchable: `${subject.name} ${subject.code || ""} ${subject.branch?.name || ""} ${subject.branch?.code || ""} ${subject.year?.label || ""}`,
      to: `/course/${subject._id || subject.id}`,
      state: {
        courseName: subject.name,
        courseCode: subject.code,
        yearName: subject.year?.label,
      },
    }));

    const branchYears = new Map();
    catalogue.subjects.forEach((subject) => {
      const branch = subject.branch;
      const year = subject.year;
      if (!branch?._id || !year?._id) return;
      branchYears.set(`${branch._id}-${year._id}`, { branch, year });
    });
    const branches = [...branchYears.values()].map(({ branch, year }) => ({
      id: `branch-${branch._id}-${year._id}`,
      type: "Branch",
      title: branch.name,
      detail: `${branch.code || "Branch"} · ${year.label}`,
      icon: Building2,
      searchable: `${branch.name} ${branch.code || ""} ${year.label}`,
      to: `/year/${year._id}?branch=${branch._id}`,
      state: { yearName: year.label },
    }));

    return [...subjects, ...years, ...branches]
      .filter((item) => item.searchable.toLowerCase().includes(q))
      .sort((a, b) => {
        const aStarts = a.title.toLowerCase().startsWith(q) ? 0 : 1;
        const bStarts = b.title.toLowerCase().startsWith(q) ? 0 : 1;
        return aStarts - bStarts || a.title.localeCompare(b.title);
      })
      .slice(0, 8);
  }, [catalogue, query]);

  const selectResult = (result) => {
    setOpen(false);
    setQuery(result.title);
    navigate(result.to, { state: result.state });
  };

  const handleChange = (event) => {
    setQuery(event.target.value);
    setOpen(true);
    setActiveIndex(-1);
    onQueryChange?.(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (!results.length) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index <= 0 ? results.length - 1 : index - 1));
    } else if (event.key === "Enter") {
      event.preventDefault();
      selectResult(results[activeIndex >= 0 ? activeIndex : 0]);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className={`relative z-30 ${className}`}>
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-black/10 focus-within:border-[#5d8d70]">
        <Search className="ml-3 h-5 w-5 shrink-0 text-slate-400" />
        <input
          value={query}
          onChange={handleChange}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label="Search the StudyBase catalogue"
          aria-expanded={open && Boolean(query.trim())}
          className="min-w-0 flex-1 bg-transparent px-1 py-3 text-sm text-slate-800 outline-none sm:text-base"
        />
        <span className="hidden rounded-xl bg-[#efb54a] px-4 py-3 text-xs font-black text-[#34230a] sm:block">Press Enter ↵</span>
      </div>

      {open && query.trim() && (
        <div className="absolute inset-x-0 top-[calc(100%+8px)] overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 text-left shadow-2xl">
          {results.length ? results.map((result, index) => {
            const Icon = result.icon;
            return (
              <button
                key={result.id}
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectResult(result)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 transition ${index === activeIndex ? "bg-[#edf5ef]" : "hover:bg-slate-50"}`}
              >
                <span className="rounded-xl bg-[#edf5ef] p-2 text-[#184d36]"><Icon className="h-4 w-4" /></span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-slate-900">{result.title}</span>
                  <span className="block truncate text-xs text-slate-500">{result.detail}</span>
                </span>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-slate-500">{result.type}</span>
              </button>
            );
          }) : (
            <div className="px-4 py-6 text-center">
              <p className="text-sm font-bold text-slate-700">No matches yet</p>
              <p className="mt-1 text-xs text-slate-500">Try a year, branch code, subject name or course code.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PortalSearch;
