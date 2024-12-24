export default function objectToFormData(obj: Record<string, any>): FormData {
  const formData = new FormData();

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      if (Array.isArray(value)) {
        // Append array elements individually
        value.forEach((item) => formData.append(`${key}[]`, item));
      } else {
        // Append other types directly
        formData.append(key, value);
      }
    }
  }

  return formData;
}
