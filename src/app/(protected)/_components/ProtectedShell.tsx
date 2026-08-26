import type { ReactNode } from "react";
import AccountMenu from "@/app/_components/account-menu/AccountMenu";
import Header from "@/app/_components/header/PrivateHeader";
import DesktopSidebar from "@/app/_components/sidebar/DesktopSidebar";
import { MAIN_CONTENT_ID } from "@/shared/constants";
import MobileNavigation from "./MobileNavigation";
import styles from "./ProtectedShell.module.css";

interface Props {
  children: ReactNode;
  accountUser?: { username: string; email: string };
}

const navigationItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/transaction", label: "Transactions" },
];

export default function ProtectedShell({ children, accountUser }: Props) {
  return (
    <div className="flex min-h-screen flex-1 flex-col bg-background">
      <Header
        mobileNavigation={<MobileNavigation items={navigationItems} />}
        accountMenu={<AccountMenu user={accountUser} />}
      />

      <div className="flex flex-1">
        <DesktopSidebar navigationItems={navigationItems} />

        <main id={MAIN_CONTENT_ID} className={styles.mainContent}>
          {children}
        </main>
      </div>
    </div>
  );
}
