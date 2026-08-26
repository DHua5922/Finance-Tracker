"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import NavigationIcon from "@/app/_components/navigation/NavigationIcon";
import MobileSidebar from "@/app/_components/sidebar/MobileSidebar";
import { cn } from "@/shared/utilities";
import styles from "./MobileNavigation.module.css";

interface Props {
  items: { href: string; label: string }[];
}

function useFocusTrap() {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarId = useId();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const closeNavigation = useCallback(() => {
    setIsOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeNavigation();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeNavigation]);

  return {
    menuButtonRef,
    sidebarId,
    closeButtonRef,
    isOpen,
    setIsOpen,
    closeNavigation,
  };
}

export default function MobileNavigation({ items }: Props) {
  const {
    menuButtonRef,
    sidebarId,
    closeButtonRef,
    isOpen,
    setIsOpen,
    closeNavigation,
  } = useFocusTrap();

  return (
    <>
      <button
        ref={menuButtonRef}
        type="button"
        className={cn(styles.iconButton, "md:hidden")}
        aria-label="Open navigation menu"
        aria-controls={sidebarId}
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
      >
        <MenuIcon />
      </button>

      <button
        type="button"
        aria-label="Close navigation menu"
        tabIndex={isOpen ? 0 : -1}
        className={cn(styles.backdrop, isOpen && styles.backdropOpen)}
        onClick={closeNavigation}
      />

      <MobileSidebar
        sidebarId={sidebarId}
        closeButtonRef={closeButtonRef}
        isOpen={isOpen}
        closeNavigation={closeNavigation}
        items={items}
        setIsOpen={setIsOpen}
      />
    </>
  );
}

function MenuIcon() {
  return <NavigationIcon path="M4 6h16M4 12h16M4 18h16" />;
}
