import { uploadImageAction } from "@/actions/image";
import { useCsrfToken } from "@/components/CsrfContext";
import Dropzone from "@/components/Dropzone";
import { InputTags } from "@/components/InputTags";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ACCEPTED_IMAGE_MIME_TYPES, MAX_FILE_SIZE } from "@/constants/file";
import { cn } from "@/lib/utils";
import objectToFormData from "@/utils/object-to-form-data";
import { slugify } from "@/utils/slug";
import { PostSchemaType } from "@/validations/post";
import { RotateCcwIcon } from "lucide-react";
import React, { MouseEvent } from "react";
import { useFormContext } from "react-hook-form";
import { dummyTags } from "@/data/tags";
import { showErrorToast } from "@/utils/show-toasts";
import { useToast } from "@/components/ui/use-toast";
import { ActionResponse } from "@/types/action-response";
import TooltipWrapper from "@/components/TooltipWrapper";

async function fetchTags(query: string): Promise<string[]> {
  return dummyTags.filter((tag) => tag.includes(query));
}

const PostMetadataForm = () => {
  const csrfToken = useCsrfToken();
  const form = useFormContext<PostSchemaType>();
  const { toast } = useToast();

  const handleGenerateSlugOnClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    form.setFocus("slug");
    form.setValue("slug", "");
    const title = form.getValues("title") as string;
    if (title === "" || title == undefined) {
      form.setError(
        "slug",
        { type: "manual", message: "title is empty" },
        { shouldFocus: true }
      );
      return;
    }
    form.clearErrors("slug");
    form.setValue("slug", slugify(title));
  };

  async function handleOnDrop(acceptedFiles: FileList | null) {
    if (acceptedFiles && acceptedFiles[0]) {
      const file = acceptedFiles[0];

      const formData = objectToFormData({
        file: file,
        csrf_token: csrfToken,
      });
      const response: ActionResponse = await uploadImageAction(formData);
      if (response?.error) {
        form.setValue("image.url", "");
        form.setValue("image.name", "");

        if (typeof response?.error === "string") {
          showErrorToast(toast, response.error);
        }

        if (typeof response?.error === "object") {
          for (const [key, message] of Object.entries(response.error)) {
            form.setError("image.name", {
              type: "manual",
              message,
            });
          }
        }
        return;
      }

      form.setValue("image.name", response.image.name, {
        shouldValidate: true,
      });
      form.setValue("image.url", response.image.url, {
        shouldValidate: true,
      });

      const isNameValid = await form.trigger("image.name");

      if (isNameValid) {
        form.clearErrors("image.name");
      }
    } else {
      form.setValue("image.url", "");
      form.setValue("image.name", "", { shouldValidate: true });
    }
  }

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="image.name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Thumbnail</FormLabel>
            <FormControl>
              <>
                <Dropzone
                  {...field}
                  accept=".jpg,.jpeg,.png,.webp"
                  dropMessage="Drop file or click here"
                  handleOnDrop={handleOnDrop}
                  previewURL={
                    form.watch("image.url") != ""
                      ? form.watch("image.url") + "?h=120"
                      : ""
                  }
                  classNameWrapper="relative h-32"
                />
              </>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="image.alt"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input placeholder="Enter thumbnail alt text" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="slug"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Slug</FormLabel>
            <FormControl>
              <div className="relative">
                <TooltipWrapper content="Generate from title">
                  <Button
                    variant={"ghost"}
                    type="button"
                    className="absolute right-0"
                    onClick={handleGenerateSlugOnClick}
                  >
                    <RotateCcwIcon size={14} />{" "}
                  </Button>
                </TooltipWrapper>

                <Input
                  type="text"
                  autoComplete="name"
                  placeholder="e.g. my-post-title"
                  {...field}
                  className={cn(
                    "pr-11",
                    form.formState.errors.slug
                      ? "border border-destructive focus-visible:ring-destructive"
                      : "border border-border"
                  )}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="tags"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tags</FormLabel>
            <FormControl>
              <InputTags
                fetchTags={fetchTags}
                value={field.value}
                onChange={(newTags) => field.onChange(newTags)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="preview"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Summary</FormLabel>
            <FormControl>
              <Textarea
                rows={5}
                placeholder="Enter post summary or preview short text..."
                {...field}
                className={
                  form.formState.errors.preview
                    ? "border border-destructive focus-visible:ring-destructive"
                    : "border border-border"
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default PostMetadataForm;
