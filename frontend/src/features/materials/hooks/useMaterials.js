import { useCallback, useEffect, useState } from "react";
import { getMaterials } from "@/api/materialApi";

/**
 * options = { subjectId }
 */
export function useMaterials(options = {}) {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMaterials = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!options.subjectId) {
        setMaterials([]);
        return;
      }

      const res = await getMaterials(options.subjectId);
      // Backend returns { count, data: [...] }
      const data = res.data?.data || res.data || [];

      setMaterials(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch materials:", err);
      setError("Failed to load materials for this course.");
    } finally {
      setLoading(false);
    }
  }, [options.subjectId]);

  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  return { materials, loading, error, refetch: fetchMaterials };
}
