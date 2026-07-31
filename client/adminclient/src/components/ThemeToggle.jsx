import { useContext } from "react";
import { Moon, Sun } from "lucide-react";

import { ThemeContext } from "@/Context/ThemeContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * One toggle for the whole app — previously each page shipped its own
 * emoji button with slightly different placement and colours.
 */
export default function ThemeToggle({ className, variant = "ghost" }) {
  const { isDark, toggleTheme } = useContext(ThemeContext);

  return (
    <Button
      type="button"
      variant={variant}
      size="icon"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={cn("text-muted-foreground hover:text-foreground", className)}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
