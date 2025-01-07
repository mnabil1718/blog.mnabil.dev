import { FieldErrors } from "react-hook-form";
import { showErrorToast } from "./show-toasts";

export function displayFormErrorsToast(err: FieldErrors<any>, toast: any) {
  for (const [key, value] of Object.entries(err)) {
    if (value && typeof value === "object" && !("message" in value)) {
      // Nested fields: iterate through the nested object
      for (const [nestedKey, nestedValue] of Object.entries(value)) {
        if (
          nestedValue &&
          typeof nestedValue === "object" &&
          "message" in nestedValue
        ) {
          showErrorToast(toast, nestedValue.message);
        }
      }
    } else if (value && typeof value === "object" && "message" in value) {
      // Direct field with an error message
      showErrorToast(toast, value.message as string);
    }
  }
}
