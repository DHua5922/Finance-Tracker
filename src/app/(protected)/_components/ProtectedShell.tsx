import type { ReactNode } from "react";
import Header from "@/app/_components/header/PrivateHeader";
import DesktopSidebar from "@/app/_components/sidebar/DesktopSidebar";
import { MAIN_CONTENT_ID } from "@/shared/constants/accessibility";
import MobileNavigation from "./MobileNavigation";
import styles from "./ProtectedShell.module.css";

interface Props {
  children: ReactNode;
}

const navigationItems = [
  { href: "/expense", label: "Expenses" },
  { href: "/income", label: "Income" },
];

export default function ProtectedShell({ children }: Props) {
  return (
    <div className="flex min-h-screen flex-1 flex-col bg-background">
      <Header mobileNavigation={<MobileNavigation items={navigationItems} />} />

      <div className="flex flex-1">
        <DesktopSidebar navigationItems={navigationItems} />

        <main id={MAIN_CONTENT_ID} className={styles.mainContent}>
          {children}
        </main>
      </div>
    </div>
  );
}
