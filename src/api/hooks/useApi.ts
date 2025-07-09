import { useEffect, useState } from "react";
import { Observable } from "rxjs";

export function useApi<T = object>(getData: Observable<T>) {
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(true);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function reload(append?: boolean) {
    setRefresh(true);

    getData.subscribe({
      next(value) {
        setData(value);
        setLoading(false);
      },
      complete() {
        setRefresh(false);
      },
      error(err) {
        setError(err as never);
      },
    });
  }

  function fullReload() {
    setLoading(true);
    reload();
  }

  function reloadAppend() {
    reload(true);
  }

  useEffect(() => {
    reload();
  }, []);

  return {
    loading: loading,
    refresh: refresh,
    data: data,
    error: error,
    reload: () => reload(),
    fullReload: fullReload,
    reloadAppend,
  };
}
