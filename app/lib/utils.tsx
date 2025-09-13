export const generatePagination = (currentPage: number, totalPages: number) => {
  // Case 1: If total pages are 5 or fewer, show all
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // Case 2: Current page is near the start
  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages];
  }

  // Case 3: Current page is near the end
  if (currentPage >= totalPages - 2) {
    return [1, "...", totalPages - 2, totalPages - 1, totalPages];
  }

  // Case 4: Current page in the middle
  return [1, "...", currentPage, "...", totalPages];
};
