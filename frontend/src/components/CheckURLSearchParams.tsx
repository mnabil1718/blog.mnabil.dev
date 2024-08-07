"use client";

import useCheckSearchParams from "@/hooks/useCheckSearchParams";

// the reason we use this client component to show toasts
// is because every page will be rendered as server component.
// Therefore in order to use hooks we embed a client component.
const CheckURLSearchParams = () => {
  useCheckSearchParams();

  return null;
};

export default CheckURLSearchParams;
