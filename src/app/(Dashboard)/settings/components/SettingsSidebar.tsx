"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SettingsSidebar = () => {
  const path = usePathname();

  return (
    <nav className="grid gap-4 text-base text-muted-foreground">
      <Link
        href="/settings"
        className={cn(path === "/settings" && `font-semibold text-primary`)}
      >
        Profile
      </Link>
      <Link
        href="/settings/integrations"
        className={cn(
          path === "/settings/integrations" && `font-semibold text-primary`
        )}
      >
        Integrations
      </Link>
    </nav>
  );
};

export default SettingsSidebar;
