import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import React, { ChangeEvent, useRef, useState } from "react";

interface DropzoneProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange"
  > {
  classNameWrapper?: string;
  className?: string;
  dropMessage: string;
  accept: string;
  previewURL: string;
  handleOnDrop: (acceptedFiles: FileList | null) => void | Promise<void>;
}

const Dropzone = React.forwardRef<HTMLDivElement, DropzoneProps>(
  (
    {
      className,
      classNameWrapper,
      dropMessage,
      accept,
      previewURL,
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
          `flex items-center justify-center border-2 border-dashed bg-slate-50 hover:cursor-pointer hover:border-muted-foreground/50 overflow-hidden`,
          classNameWrapper
        )}
      >
        <CardContent
          className="flex w-full h-full items-center justify-center p-0 text-xs"
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
            <span className="font-medium hover:underline">
              {previewURL !== "" ? "" : dropMessage}
            </span>
            <Input
              {...props}
              value={undefined}
              ref={inputRef}
              type="file"
              multiple={false}
              accept={accept}
              className={cn("hidden", className)}
              onChange={handleFileInputChange}
            />
          </div>

          {previewURL !== "" && (
            <div className="relative w-full h-full justify-center group">
              <Image
                src={previewURL}
                alt="Thumbnail Preview"
                fill
                className="object-contain"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition duration-200">
                <span className="text-white font-medium px-2 py-1 border border-white rounded-full">
                  Change
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
);

Dropzone.displayName = "Dropzone";
export default Dropzone;
