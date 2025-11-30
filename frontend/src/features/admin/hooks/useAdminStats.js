import { useCallback, useEffect, useState } from "react";
import { getAllBranches } from "@/api/branchApi";
import { getAllYears } from "@/api/yearApi";
import { getSubjects } from "@/api/subjectApi";

export function useAdminStats() {
  const [stats, setStats] = useState({
    branches: 0,
    years: 0,
    subjects: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [branchesRes, yearsRes, subjectsRes] = await Promise.all([
        getAllBranches(),
        getAllYears(),
        getSubjects({}),
      ]);

      const branches = branchesRes.data || branchesRes;
      const years = yearsRes.data || yearsRes;
      const subjects = subjectsRes.data || subjectsRes;

      setStats({
        branches: Array.isArray(branches) ? branches.length : 0,
        years: Array.isArray(years) ? years.length : 0,
        subjects: Array.isArray(subjects) ? subjects.length : 0,
      });
    } catch (err) {
      console.error("Failed to load admin stats:", err);
      setError("Failed to load dashboard statistics.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}
