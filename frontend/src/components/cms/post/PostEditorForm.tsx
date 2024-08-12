import Editor from "@/components/editor/editor";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { PostSchemaType } from "@/validations/post";
import { EditorState, LexicalEditor } from "lexical";
import { UseFormReturn } from "react-hook-form";

const PostEditorForm = ({ form }: { form: UseFormReturn<PostSchemaType> }) => {
  return (
    <FormField
      control={form.control}
      name="content"
      defaultValue=""
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Editor
              {...field}
              onChange={(
                editorState: EditorState,
                editor: LexicalEditor,
                tags: Set<string>
              ) => {
                editor.update(() => {
                  const content = JSON.stringify(editor.getEditorState());
                  field.onChange(content);
                });
              }}
              className={
                form.formState.errors.content &&
                "border border-destructive focus-visible:ring-destructive"
              }
            />

            {/* <Input
                type="text"
                autoComplete="name"
                placeholder="e.g. John Doe"
                {...field}
                className={
                  form.formState.errors.content
                    ? "border border-destructive focus-visible:ring-destructive"
                    : "border border-border"
                }
              /> */}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PostEditorForm;
