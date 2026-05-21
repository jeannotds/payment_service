import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  fullWidth?: boolean;
};

export function Button({
  className,
  variant = "primary",
  fullWidth,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-11 items-center justify-center rounded-xl px-5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" &&
          "bg-primary text-white shadow-[0_10px_24px_-10px_rgb(13_148_136_/_0.8)] hover:bg-primary-hover",
        variant === "secondary" &&
          "border border-border bg-surface text-foreground hover:border-border-strong hover:bg-surface-muted",
        variant === "ghost" && "text-muted hover:bg-surface-muted hover:text-foreground",
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
