import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-xl bg-emerald-100 dark:bg-emerald-900/60", className)}
      {...props}
    />
  );
}
