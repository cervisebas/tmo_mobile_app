import { useEffect, useState } from "react";
import { Observable } from "rxjs";

export function useApi<T = object>(getData: Observable<T>) {
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(true);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function reload() {
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

  useEffect(() => {
    reload();
  }, []);

  return {loading, refresh, data, error, reload};
}
