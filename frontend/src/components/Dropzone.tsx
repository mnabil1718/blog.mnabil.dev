import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import React, { ChangeEvent, useRef, useState, useEffect } from "react";

interface DropzoneProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange"
  > {
  classNameWrapper?: string;
  className?: string;
  dropMessage: string;
  accept: string;
  multiple: boolean;
  handleOnDrop: (acceptedFiles: FileList | null) => void | Promise<void>;
}

const Dropzone = React.forwardRef<HTMLDivElement, DropzoneProps>(
  (
    {
      className,
      classNameWrapper,
      dropMessage,
      accept,
      multiple,
      handleOnDrop,
      ...props
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Function to handle drop and manage loading state
    const handleAction = async (files: FileList | null) => {
      setIsLoading(true);
      try {
        await Promise.resolve(handleOnDrop(files));
      } finally {
        setIsLoading(false);
      }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      const { files } = e.dataTransfer;
      if (inputRef.current) {
        inputRef.current.files = files;
        await handleAction(files);
      }
    };

    const handleFileInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files) {
        await handleAction(files);
      }
    };

    const handleButtonClick = () => {
      if (inputRef.current) {
        inputRef.current.click();
      }
    };

    return (
      <Card
        ref={ref}
        className={cn(
          `relative flex items-center justify-center border-2 border-dashed bg-slate-50 hover:cursor-pointer hover:border-muted-foreground/50`,
          classNameWrapper
        )}
      >
        <CardContent
          className="flex items-center justify-center px-2 py-4 text-xs"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleButtonClick}
        >
          {/* LOADING SPINNER */}
          {isLoading && (
            <div className="absolute bottom-1 right-1 animate-spin">
              <Loader2 width={16} height={16} className="text-slate-400" />
            </div>
          )}

          <div className="flex items-center justify-center text-muted-foreground">
            <span className="font-medium">{dropMessage}</span>
            <Input
              {...props}
              value={undefined}
              ref={inputRef}
              type="file"
              multiple={multiple}
              accept={accept}
              className={cn("hidden", className)}
              onChange={handleFileInputChange}
            />
          </div>
        </CardContent>
      </Card>
    );
  }
);

Dropzone.displayName = "Dropzone";
export default Dropzone;
