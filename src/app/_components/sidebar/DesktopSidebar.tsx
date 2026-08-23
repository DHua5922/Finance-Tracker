import NavLinks from "../navigation/NavLinks";
import styles from "./DesktopSidebar.module.css";

interface Props {
  navigationItems: { href: string; label: string }[];
}

export default function DesktopSidebar({ navigationItems }: Props) {
  return (
    <aside className={styles.desktopSidebar}>
      <NavLinks
        aria-label="Finance navigation"
        navigationItems={navigationItems}
      />
    </aside>
  );
}
