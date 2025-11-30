import { useMemo, useState } from "react";

export function usePagination(items = [], pageSize = 10, initialPage = 1) {
  const [page, setPage] = useState(initialPage);

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const currentPage = Math.min(page, totalPages);

  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, currentPage, pageSize]);

  const next = () => setPage((p) => Math.min(p + 1, totalPages));
  const prev = () => setPage((p) => Math.max(p - 1, 1));
  const goTo = (p) => {
    const n = Number(p) || 1;
    setPage(Math.min(Math.max(n, 1), totalPages));
  };

  return {
    page: currentPage,
    pageSize,
    total,
    totalPages,
    items: pageItems,
    next,
    prev,
    goTo,
  };
}
