export function getPaginationPages(
  totalPages: number,
  currentPage: number
): { start: number; end: number; pages: number[] } {
  const pages: number[] = [];

  // Edge case: totalPages = 1
  if (totalPages <= 1) {
    return { start: 0, end: 0, pages };
  }

  let maxWindowSize = 3; // Default window size
  if (
    currentPage <= 4 || // Left edge case
    currentPage >= totalPages - 3 // Right edge case
  ) {
    maxWindowSize = 4; // Expand to 4 when near edges
  }

  // Calculate start and end bounds
  let start = Math.max(2, currentPage - Math.floor(maxWindowSize / 2));
  let end = Math.min(totalPages - 1, start + maxWindowSize - 1);

  // Adjust when near edges to ensure 4 pages are rendered
  if (currentPage <= 4) {
    start = 2;
    end = Math.min(totalPages - 1, start + 3);
  }
  if (currentPage >= totalPages - 3) {
    end = totalPages - 1;
    start = Math.max(2, end - 3);
  }

  // Generate the pages array
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return { start, end, pages };
}
