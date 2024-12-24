"use client";

import useShowFlashMessage from "@/hooks/useShowFlashMessage";

// the reason we use this client component to show toasts
// is because every page will be rendered as server component.
// Therefore in order to use hooks we embed a client component.
const ShowFlashMessage = () => {
  useShowFlashMessage();

  return null;
};

export default ShowFlashMessage;
