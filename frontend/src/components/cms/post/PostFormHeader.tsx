import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PostSchemaType } from "@/validations/post";
import {
  CheckCircle2,
  CircleX,
  CloudOff,
  LoaderCircle,
  Save,
  Send,
} from "lucide-react";
import React from "react";
import { useFormContext } from "react-hook-form";
import { MobileSidePanel } from "./MobileSidePanel";
import { POST_ACTION, POST_STATUS } from "@/constants/post";
import TooltipWrapper from "@/components/TooltipWrapper";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const PostFormHeader = () => {
  const form = useFormContext<PostSchemaType>();

  return (
    <div className="relative p-5 w-full flex items-center gap-2 bg-background rounded-md border">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormControl>
              <Input
                type="text"
                autoComplete="title"
                placeholder="Enter Post Title..."
                {...field}
                className={
                  form.formState.errors.title
                    ? "border border-destructive focus-visible:ring-destructive"
                    : "border border-border"
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* LOADER ICONS */}

      <div className="p-2 hidden md:block">
        {form.formState.isSubmitting && (
          <LoaderCircle size={14} className="animate-spin" />
        )}
        {!form.formState.isSubmitting && form.formState.isDirty && (
          <TooltipWrapper content="unsaved changes">
            <CloudOff size={14} className="text-muted-foreground" />
          </TooltipWrapper>
        )}
        {!form.formState.isSubmitting && !form.formState.isDirty && (
          <TooltipWrapper content="saved changes">
            <CheckCircle2 size={14} className="text-muted-foreground" />
          </TooltipWrapper>
        )}
      </div>

      {/* SAVE */}
      <Button
        type="submit"
        name="action"
        value={POST_ACTION.SAVE}
        variant={"outline"}
        className="flex items-center gap-2"
        disabled={form.formState.isSubmitting}
      >
        <Save size={14} />
        <span className="hidden md:block">Save</span>
      </Button>

      {/* UNPUBLISH */}
      {(form.getValues("status") as string) == POST_STATUS.PUBLISHED && (
        <Button
          type="submit"
          name="action"
          value={POST_ACTION.UNPUBLISH}
          className="flex items-center gap-2"
          disabled={form.formState.isSubmitting}
        >
          <CircleX size={14} />
          <span className="hidden md:block">Unpublish</span>
        </Button>
      )}

      {/* PUBLISH */}
      {(form.getValues("status") as string) != POST_STATUS.PUBLISHED && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              type="button"
              className="flex items-center gap-2"
              disabled={form.formState.isSubmitting}
            >
              <Send size={14} />
              <span className="hidden md:block">Publish</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will publish your post to the public for anyone to
                view. Unsaved changes will be saved.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              {/* NOTICE: form attr is the same as form id */}
              <AlertDialogAction
                form="post-form"
                type="submit"
                name="action"
                value={POST_ACTION.PUBLISH}
              >
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      <div className="block xl:!hidden">
        <MobileSidePanel />
      </div>
    </div>
  );
};

export default PostFormHeader;
