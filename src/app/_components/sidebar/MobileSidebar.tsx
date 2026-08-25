import type { ReactNode, RefObject } from "react";
import { cn } from "@/shared/utilities/css.utilities";
import NavigationIcon from "../navigation/NavigationIcon";
import NavLinks from "../navigation/NavLinks";
import styles from "./MobileSidebar.module.css";

interface Props {
  sidebarId: string;
  closeButtonRef: RefObject<HTMLButtonElement | null>;
  isOpen: boolean;
  closeNavigation: () => void;
  items: { href: string; label: string }[];
  setIsOpen: (isOpen: boolean) => void;
  logoutButton: ReactNode;
}

export default function Sidebar({
  sidebarId,
  closeButtonRef,
  isOpen,
  closeNavigation,
  items,
  setIsOpen,
  logoutButton,
}: Props) {
  return (
    <aside
      id={sidebarId}
      className={cn(styles.sidebar, isOpen && styles.sidebarOpen)}
    >
      <div className="mb-5 flex items-center justify-between">
        <span className="font-semibold">Navigation</span>
        <button
          ref={closeButtonRef}
          type="button"
          className={styles.iconButton}
          aria-label="Close navigation menu"
          onClick={closeNavigation}
        >
          <CloseIcon />
        </button>
      </div>

      <NavLinks
        aria-label="Mobile finance navigation"
        navigationItems={items}
        onClick={() => setIsOpen(false)}
      />
      {logoutButton}
    </aside>
  );
}

function CloseIcon() {
  return <NavigationIcon path="M6 6l12 12M18 6l-12 12" />;
}
