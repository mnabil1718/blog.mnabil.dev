"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { type InputProps } from "@/components/ui/input";
import { debounce } from "lodash-es";
import { slugify } from "@/utils/slug";

type InputTagsProps = Omit<InputProps, "value" | "onChange"> & {
  value: string[];
  onChange: React.Dispatch<React.SetStateAction<string[]>>;
  placeholder?: string;
  fetchTags: (query: string) => Promise<string[]>;
};

const InputTags = React.forwardRef<HTMLInputElement, InputTagsProps>(
  (
    {
      className,
      value,
      onChange,
      placeholder = "Enter tag values comma separated",
      fetchTags,
      ...props
    },
    ref
  ) => {
    const [pendingDataPoint, setPendingDataPoint] = React.useState("");
    const [suggestions, setSuggestions] = React.useState<string[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);
    const [highlightedIndex, setHighlightedIndex] = React.useState<number>(-1);
    const popoverRef = React.useRef<HTMLDivElement>(null);
    const suggestionRefs = React.useRef<(HTMLDivElement | null)[]>([]);

    // Debounced fetchTags function
    const debouncedFetchTags = React.useMemo(
      () =>
        debounce(async (query: string) => {
          setIsLoading(true);
          try {
            const results = await fetchTags(query);
            setSuggestions(results.filter((tag) => !value.includes(tag)));
            setHighlightedIndex(-1); // Reset highlighted index
          } finally {
            setIsLoading(false);
          }
        }, 300),
      [fetchTags, value]
    );

    // Fetch suggestions when pendingDataPoint changes
    React.useEffect(() => {
      if (pendingDataPoint.trim()) {
        debouncedFetchTags(pendingDataPoint);
      } else {
        setSuggestions([]);
      }
    }, [pendingDataPoint, debouncedFetchTags]);

    const addPendingDataPoint = (newTag: string) => {
      if (newTag) {
        const newDataPoints = new Set([...value, newTag]);
        onChange(Array.from(newDataPoints));
        setPendingDataPoint("");
        setSuggestions([]);
        setHighlightedIndex(-1);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
          addPendingDataPoint(suggestions[highlightedIndex]);
        } else {
          addPendingDataPoint(slugify(pendingDataPoint));
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIndex((prevIndex) => {
          const nextIndex =
            prevIndex < suggestions.length - 1 ? prevIndex + 1 : 0;
          scrollToSuggestion(nextIndex);
          return nextIndex;
        });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIndex((prevIndex) => {
          const nextIndex =
            prevIndex > 0 ? prevIndex - 1 : suggestions.length - 1;
          scrollToSuggestion(nextIndex);
          return nextIndex;
        });
      } else if (
        e.key === "Backspace" &&
        pendingDataPoint.length === 0 &&
        value.length > 0
      ) {
        e.preventDefault();
        onChange(value.slice(0, -1));
      }
    };

    const scrollToSuggestion = (index: number) => {
      const suggestionElement = suggestionRefs.current[index];
      if (suggestionElement) {
        suggestionElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    };

    // Close popover when clicking outside
    React.useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (
          popoverRef.current &&
          !popoverRef.current.contains(e.target as Node)
        ) {
          setIsFocused(false);
        }
      };

      if (isFocused) {
        document.addEventListener("mousedown", handleClickOutside);
      } else {
        document.removeEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isFocused]);

    return (
      <div className="relative w-full">
        <div
          className={cn(
            "min-h-10 flex w-full flex-wrap gap-2 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950",
            className
          )}
        >
          {value.map((item) => (
            <Badge key={item} variant="secondary">
              {item}
              <Button
                variant="ghost"
                size="icon"
                className="ml-2 h-3 w-3"
                onClick={() => {
                  onChange(value.filter((i) => i !== item));
                }}
              >
                <XIcon className="w-3" />
              </Button>
            </Badge>
          ))}
          <input
            className="flex-1 min-w-0 shrink outline-none overflow-hidden placeholder:text-neutral-500 dark:placeholder:text-neutral-400"
            value={pendingDataPoint}
            placeholder={value.length > 0 ? "" : placeholder}
            onBlur={(e) => {
              if (!popoverRef.current?.contains(e.relatedTarget)) {
                setIsFocused(false);
              }
            }}
            onFocus={() => setIsFocused(true)}
            onChange={(e) => setPendingDataPoint(e.target.value)}
            onKeyDown={handleKeyDown}
            {...props}
            ref={ref}
          />
        </div>
        {/* Render Suggestions */}
        {isFocused && suggestions.length > 0 && (
          <div
            ref={popoverRef}
            tabIndex={-1}
            className="absolute z-10 mt-2 max-h-40 w-full overflow-y-auto rounded-md border bg-white shadow-md soft-scroll"
          >
            {isLoading ? (
              <div className="px-3 py-2 text-sm text-neutral-500">
                Loading...
              </div>
            ) : (
              suggestions.map((suggestion, index) => (
                <div
                  ref={(el) => {
                    suggestionRefs.current[index] = el;
                  }}
                  tabIndex={0}
                  key={suggestion}
                  className={cn(
                    "cursor-pointer px-3 py-2 text-sm",
                    highlightedIndex === index
                      ? "bg-neutral-100 dark:bg-neutral-700"
                      : "hover:bg-neutral-100 dark:hover:bg-neutral-700"
                  )}
                  onClick={() => addPendingDataPoint(suggestion)}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  {suggestion}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    );
  }
);

InputTags.displayName = "InputTags";

export { InputTags };
