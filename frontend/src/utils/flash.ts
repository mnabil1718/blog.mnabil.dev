// in middleware we can't modify cookies directly.
// So instead use this to generate 'Set-Cookie' header.
export function generateSetFlashMessageHeader(
  type: "error" | "success",
  message: string,
  key: string = "flash_message"
): string {
  return `${key}=${JSON.stringify({
    type,
    message,
  })}`;
}
