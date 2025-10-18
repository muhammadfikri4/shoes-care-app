type FormatDate = "DD-MM-YYYY" | "MM-DD-YYYY" | "YYYY-MM-DD";

export function formatDateToMMDDYYYY(
  date: Date | string,
  format: FormatDate = "DD-MM-YYYY"
): string {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  switch (format) {
    case "DD-MM-YYYY":
      return `${day}-${month}-${year}`;
    case "MM-DD-YYYY":
      return `${month}-${day}-${year}`;
    case "YYYY-MM-DD":
      return `${year}-${month}-${day}`;
  }
}
