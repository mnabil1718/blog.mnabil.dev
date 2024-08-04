import { isAxiosError } from "axios";

export async function GET(request: Request) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/tokens/csrf`,
      {
        cache: "no-store",
        credentials: "include",
      }
    );
    if (!response.ok) {
      return Response.json(
        { error: "Cannot fetch csrf token" },
        { status: 400 }
      );
    } else {
      const { token } = await response.json();
      return Response.json(
        { token },
        {
          status: 200,
          headers: {
            "Set-Cookie": response.headers.getSetCookie()[0],
          },
        }
      );
    }
  } catch (error) {
    if (isAxiosError(error)) {
      return Response.json({ error: error.message }, { status: error.status });
    } else {
      return Response.json(
        { error: "Something unexpected happens" },
        { status: 500 }
      );
    }
  }
}
