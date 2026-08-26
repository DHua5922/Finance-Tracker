"use client";

import { Menu } from "@dhua5922/react-kit";
import { useTransition } from "react";
import { logOutAction } from "@/features/auth/server";
import styles from "./AccountMenu.module.css";

interface Props {
  user?: { username: string; email: string };
}

export default function AccountMenu({ user }: Props) {
  const [isLoggingOut, startLogout] = useTransition();

  return (
    <Menu popupOffsetVertical={8}>
      <Menu.Toggle
        className={styles.toggle}
        aria-label="Open account menu"
        aria-haspopup="menu"
      >
        <AccountIcon />
      </Menu.Toggle>

      <Menu.Content
        className={styles.content}
        role="menu"
        aria-label="Account menu"
      >
        {user && (
          <div className={styles.identity} role="presentation">
            <p className={styles.username}>{user.username}</p>
            <p className={styles.email}>{user.email}</p>
          </div>
        )}

        <Menu.Item
          className={styles.item}
          role="menuitem"
          onClick={() => window.location.assign("/profile")}
        >
          Profile
        </Menu.Item>

        <Menu.Item
          className={`${styles.item} text-[var(--danger-foreground)]!`}
          role="menuitem"
          disabled={isLoggingOut}
          onClick={() => startLogout(() => logOutAction())}
        >
          {isLoggingOut ? "Logging out..." : "Log out"}
        </Menu.Item>
      </Menu.Content>
    </Menu>
  );
}

function AccountIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="size-5"
    >
      <path d="M20 21a8 8 0 0 0-16 0M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
    </svg>
  );
}
