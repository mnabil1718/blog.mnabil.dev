import { useToast } from "@/components/ui/use-toast";
import { showErrorToast, showSuccessToast } from "@/utils/show-toasts";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

function useCheckSearchParams() {
  const { toast } = useToast();
  const params = useSearchParams();
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (params.has("flash_message") && params.has("flash_type")) {
      const flashMessage = params.get("flash_message") as string;
      const flashType = params.get("flash_type") as string;
      setMessage(flashMessage);
      if (flashType == "error") {
        showErrorToast(toast, message);
      } else {
        showSuccessToast(toast, message);
      }
    }
  }, [message, params, toast]);

  return { message };
}

export default useCheckSearchParams;
