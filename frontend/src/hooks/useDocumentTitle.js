import { useEffect } from "react";

export function useDocumentTitle(title, options = {}) {
  const { preserveOnUnmount = false } = options;

  useEffect(() => {
    const prevTitle = document.title;
    if (title) {
      document.title = title;
    }

    return () => {
      if (!preserveOnUnmount) {
        document.title = prevTitle;
      }
    };
  }, [title, preserveOnUnmount]);
}
