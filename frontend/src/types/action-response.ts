export type ErrorResponse = Partial<Record<keyof FormData, string>>;

export interface ActionResponse {
  message?: string;
  error?: string | ErrorResponse;
  [key: string]: any;
}
