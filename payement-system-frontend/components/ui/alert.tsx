import { cn } from "@/lib/utils";

type AlertProps = {
  variant?: "error" | "success";
  children: React.ReactNode;
};

export function Alert({ variant = "error", children }: AlertProps) {
  return (
    <p
      className={cn(
        "rounded-xl border px-4 py-3 text-sm",
        variant === "error" &&
          "border-danger/40 bg-danger/10 text-danger",
        variant === "success" &&
          "border-primary/30 bg-primary-soft text-foreground",
      )}
      role="alert"
    >
      {children}
    </p>
  );
}
