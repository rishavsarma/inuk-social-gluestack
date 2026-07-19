import { formatDistanceToNow } from "date-fns";
import * as React from "react";

export function useTimeAgo(
  date: string | Date | number | undefined | null,
): string {
  return React.useMemo(() => {
    if (!date) return "";
    try {
      const dateObj = typeof date === "string" ? new Date(date) : date;
      return formatDistanceToNow(dateObj, { addSuffix: false }).replace(
        "about ",
        "",
      );
    } catch {
      return "";
    }
  }, [date]);
}
