import { useState, useEffect } from "react";

const useFetchCsrf = () => {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/tokens/csrf`,
          {
            cache: "no-store",
            credentials: "include",
          }
        );
        if (!response.ok) {
          setError("Failed to fetch CSRF token");
        } else {
          const { token } = await response.json();
          setCsrfToken(token);
        }
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "an Unexpected error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCsrfToken();
  }, []);

  return { csrfToken, error, loading };
};

export default useFetchCsrf;
