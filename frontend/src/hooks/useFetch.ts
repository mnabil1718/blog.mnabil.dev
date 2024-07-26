import { useState, useEffect } from "react";

function useFetch(url: string) {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url, {
          cache: "no-store",
          credentials: "include",
        });

        if (!response.ok) throw new Error(response.statusText);
        const data = await response.json();
        setData(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          throw error;
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, error]);

  return { data, loading, error };
}

export default useFetch;
