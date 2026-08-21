"use client";

import { useEffect, useState } from "react";
import Button from "@/shared/components/Button";
import { cn } from "@/shared/utilities/css";
import styles from "./ThemeToggle.module.css";

type Theme = "light" | "dark";

const STORAGE_KEY = "financeflow-theme";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const initialTheme = getStoredTheme() ?? getSystemTheme();
    setTheme(initialTheme);
    applyTheme(initialTheme);
    setIsMounted(true);
  }, []);

  const nextTheme = getNextTheme(theme);

  const handleToggleTheme = () => {
    const updatedTheme = getNextTheme(theme);
    setTheme(updatedTheme);
    applyTheme(updatedTheme);
    window.localStorage.setItem(STORAGE_KEY, updatedTheme);
  };

  const buttonClassName = cn(
    styles.toggleButton,
    isMounted && theme === "light" && styles.light,
  );

  return (
    <Button
      type="button"
      aria-label={`Switch to ${nextTheme} mode`}
      className={buttonClassName}
      onClick={handleToggleTheme}
    >
      {isMounted ? `${nextTheme} mode` : "theme"}
    </Button>
  );
}

function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getStoredTheme(): Theme | null {
  const savedTheme = window.localStorage.getItem(STORAGE_KEY);
  return savedTheme === "light" || savedTheme === "dark" ? savedTheme : null;
}

function getNextTheme(theme: Theme): Theme {
  return theme === "dark" ? "light" : "dark";
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}
