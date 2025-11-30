import { useEffect, useState, useCallback } from "react";
import { getAllYears } from "@/api/yearApi";

export function useYears() {
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchYears = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getAllYears();
      // Backend returns { count, data: [...] }
      const data = res.data?.data || res.data || [];
      setYears(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch years:", err);
      setError("Failed to load academic years.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchYears();
  }, [fetchYears]);

  return { years, loading, error, refetch: fetchYears };
}
