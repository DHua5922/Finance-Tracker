"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { HTMLAttributes } from "react";
import { cn } from "@/shared/utilities";
import styles from "./NavLinks.module.css";

interface Props extends HTMLAttributes<HTMLElement> {
  navigationItems: { href: string; label: string }[];
  onClick?: () => void;
}

export default function NavLinks({
  navigationItems,
  onClick,
  ...props
}: Props) {
  const pathname = usePathname();

  return (
    <nav {...props}>
      <ul className={styles.navigationList}>
        {navigationItems.map(({ href, label }) => {
          const isActive =
            pathname === href || Boolean(pathname?.startsWith(`${href}/`));

          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  styles.navigationLink,
                  isActive && styles.navigationLinkActive,
                )}
                aria-current={isActive ? "page" : undefined}
                onClick={onClick}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
