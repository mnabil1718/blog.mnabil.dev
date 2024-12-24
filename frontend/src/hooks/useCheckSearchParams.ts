import { useToast } from "@/components/ui/use-toast";
import { showErrorToast, showSuccessToast } from "@/utils/show-toasts";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

function useCheckSearchParams() {
  const { toast } = useToast();
  const params = useSearchParams();

  useEffect(() => {
    if (params.has("flash_message") && params.has("flash_type")) {
      const flashMessage = params.get("flash_message") as string;
      const flashType = params.get("flash_type") as string;

      if (flashType === "error") {
        showErrorToast(toast, flashMessage);
      } else {
        showSuccessToast(toast, flashMessage);
      }
    }
  }, [params, toast]);

  return {};
}

export default useCheckSearchParams;
