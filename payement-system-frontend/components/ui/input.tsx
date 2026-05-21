import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input({ className, error, ...props }, ref) {
    return (
      <div className="space-y-1.5">
        <input
          ref={ref}
          className={cn(
            "h-11 w-full rounded-xl border bg-surface px-4 text-sm text-foreground outline-none transition placeholder:text-muted",
            error
              ? "border-danger focus:border-danger"
              : "border-border focus:border-primary focus:ring-2 focus:ring-primary/15",
            className,
          )}
          {...props}
        />
        {error ? <p className="text-xs text-danger">{error}</p> : null}
      </div>
    );
  },
);
