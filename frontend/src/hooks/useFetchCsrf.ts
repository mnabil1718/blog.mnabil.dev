import { useState, useEffect } from "react";

const useCsrfToken = () => {
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
          throw new Error("Failed to fetch CSRF token");
        }
        const { token } = await response.json();
        setCsrfToken(token);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          throw error;
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCsrfToken();
  }, []);

  return { csrfToken, error, loading };
};

export default useCsrfToken;
