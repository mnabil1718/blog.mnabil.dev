"use client";

import {
  Pagination as PaginationContainer,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { PaginationMetadata } from "@/types/pagination";
import { getPaginationPages } from "@/utils/pagination";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function Pagination({ metadata }: { metadata: PaginationMetadata }) {
  const currPage = metadata.current_page;
  const totalPages = Math.ceil(metadata.total_records / metadata.page_size);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { start, end, pages } = getPaginationPages(totalPages, currPage);

  const onClickHandler = (page: number) => {
    if (page < 1 || page > totalPages) {
      return;
    }

    const updatedParams = new URLSearchParams(searchParams.toString());

    if (page) {
      updatedParams.set("page", page.toString());
    } else {
      updatedParams.delete("page");
    }

    const queryString = updatedParams.toString()
      ? `?${updatedParams.toString()}`
      : "";

    router.push(`${pathname}${queryString}`);
  };

  return (
    <PaginationContainer>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onClickHandler(currPage - 1)}
            aria-disabled={currPage <= 1}
            tabIndex={currPage <= 1 ? -1 : 0}
            className={
              currPage <= 1 ? "pointer-events-none opacity-50" : undefined
            }
          />
        </PaginationItem>

        <PaginationLink
          className="hover:cursor-pointer"
          onClick={() => onClickHandler(1)}
          isActive={1 === currPage}
        >
          1
        </PaginationLink>

        {start - 1 >= 3 && (
          <PaginationLink
            className="hover:cursor-pointer"
            onClick={() => onClickHandler(Math.ceil(currPage / 2))}
          >
            <ChevronsLeft size={16} />
          </PaginationLink>
        )}

        {pages.map((page, idx) => {
          return (
            <PaginationLink
              className="hover:cursor-pointer"
              key={idx}
              onClick={() => onClickHandler(page)}
              isActive={page === currPage}
            >
              {page}
            </PaginationLink>
          );
        })}

        {totalPages - end >= 3 && (
          <PaginationLink
            className="hover:cursor-pointer"
            onClick={() =>
              onClickHandler(currPage + Math.ceil((totalPages - currPage) / 2))
            }
          >
            <ChevronsRight size={16} />
          </PaginationLink>
        )}

        {totalPages > 1 && (
          <PaginationLink
            className="hover:cursor-pointer"
            onClick={() => onClickHandler(totalPages)}
            isActive={totalPages === currPage}
          >
            {totalPages}
          </PaginationLink>
        )}

        <PaginationItem>
          <PaginationNext
            onClick={() => onClickHandler(currPage + 1)}
            aria-disabled={currPage >= totalPages}
            tabIndex={currPage >= totalPages ? -1 : 0}
            className={
              currPage >= totalPages
                ? "pointer-events-none opacity-50"
                : undefined
            }
          />
        </PaginationItem>
      </PaginationContent>
    </PaginationContainer>
  );
}
