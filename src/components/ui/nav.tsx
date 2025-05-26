"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Nav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "flex items-center space-x-4 lg:space-x-6",
        className
      )}
      {...props}
    >
      <Link
        href="/dashboard"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/dashboard"
            ? "text-primary"
            : "text-muted-foreground"
        )}
      >
        Overview
      </Link>
      <Link
        href="/dashboard/activity"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/dashboard/activity"
            ? "text-primary"
            : "text-muted-foreground"
        )}
      >
        Activity
      </Link>
      <Link
        href="/dashboard/repositories"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/dashboard/repositories"
            ? "text-primary"
            : "text-muted-foreground"
        )}
      >
        Repositories
      </Link>
      <Link
        href="/dashboard/settings"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/dashboard/settings"
            ? "text-primary"
            : "text-muted-foreground"
        )}
      >
        Settings
      </Link>
    </nav>
  );
}