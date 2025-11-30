import { createContext, useContext, useState } from "react";

const StudyFiltersContext = createContext(null);

export function StudyFiltersProvider({ children }) {
  const [selectedBranch, setSelectedBranch] = useState(null); // { id, name, code }
  const [selectedYear, setSelectedYear] = useState(null);     // { id, name }

  const value = {
    selectedBranch,
    setSelectedBranch,
    selectedYear,
    setSelectedYear,
  };

  return (
    <StudyFiltersContext.Provider value={value}>
      {children}
    </StudyFiltersContext.Provider>
  );
}

export function useStudyFilters() {
  const ctx = useContext(StudyFiltersContext);
  if (!ctx) {
    throw new Error("useStudyFilters must be used within StudyFiltersProvider");
  }
  return ctx;
}
