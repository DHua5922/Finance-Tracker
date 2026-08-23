"use client";

import Link from "next/link";
import type { HTMLAttributes } from "react";
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
  return (
    <nav {...props}>
      <ul className={styles.navigationList}>
        {navigationItems.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className={styles.navigationLink}
              onClick={onClick}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
