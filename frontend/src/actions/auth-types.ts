export type ErrorResponse = Partial<Record<keyof FormData, string>>;
export interface AuthActionResponse {
  message?: string;
  error?: string | ErrorResponse;
}
