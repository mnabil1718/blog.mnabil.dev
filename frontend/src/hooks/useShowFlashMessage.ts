import { getFlashMessage } from "@/actions/flash";
import { useCsrfToken } from "@/components/CsrfContext";
import { useToast } from "@/components/ui/use-toast";
import objectToFormData from "@/utils/object-to-form-data";
import { showErrorToast, showSuccessToast } from "@/utils/show-toasts";
import { useEffect } from "react";

function useShowFlashMessage() {
  const { toast } = useToast();
  const csrfToken = useCsrfToken();

  useEffect(() => {
    async function fetchData() {
      const data = objectToFormData({
        csrf_token: csrfToken,
      });
      const response = await getFlashMessage(data);

      if (response) {
        if (response.type == "error") {
          showErrorToast(toast, response.message);
        } else {
          showSuccessToast(toast, response.message);
        }
      }
    }
    fetchData();
  }, [csrfToken, toast]);

  return {};
}

export default useShowFlashMessage;
