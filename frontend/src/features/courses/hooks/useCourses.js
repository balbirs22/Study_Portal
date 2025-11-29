import { useCallback, useEffect, useState } from "react";
import { getSubjects } from "@/api/subjectApi";

/**
 * options = { yearId?, branchId?, semester? }
 */
export function useCourses(options = {}) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getSubjects(options);
      const data = res.data || res;

      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
      setError("Failed to load courses for this year.");
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(options)]); // simple dep; fine here

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return { courses, loading, error, refetch: fetchCourses };
}
