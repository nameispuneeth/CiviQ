import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Single spinner used for every pending state, so buttons and page loaders
 * never disagree about what "busy" looks like.
 */
export function Spinner({ className, ...props }) {
  return (
    <Loader2
      className={cn("h-4 w-4 animate-spin", className)}
      aria-hidden="true"
      {...props}
    />
  );
}
