export const encodeQueryParams = (params: Record<string, string>): string => {
  const query = new URLSearchParams();

  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      const value = params[key];
      // Append only if the value is not an empty string
      if (value !== "") {
        query.append(key, value);
      }
    }
  }

  return query.toString();
};
