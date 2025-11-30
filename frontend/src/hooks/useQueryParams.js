import { useLocation, useNavigate } from "react-router-dom";
import { useCallback, useMemo } from "react";

export function useQueryParams() {
  const location = useLocation();
  const navigate = useNavigate();

  const params = useMemo(() => {
    return new URLSearchParams(location.search);
  }, [location.search]);

  const get = useCallback(
    (key) => {
      return params.get(key);
    },
    [params]
  );

  const set = useCallback(
    (key, value, options = {}) => {
      const newParams = new URLSearchParams(location.search);

      if (value === undefined || value === null || value === "") {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }

      navigate(
        {
          pathname: location.pathname,
          search: newParams.toString(),
        },
        { replace: options.replace ?? true }
      );
    },
    [location.pathname, location.search, navigate]
  );

  const remove = useCallback(
    (key, options = {}) => {
      const newParams = new URLSearchParams(location.search);
      newParams.delete(key);
      navigate(
        {
          pathname: location.pathname,
          search: newParams.toString(),
        },
        { replace: options.replace ?? true }
      );
    },
    [location.pathname, location.search, navigate]
  );

  return { get, set, remove, raw: params };
}
