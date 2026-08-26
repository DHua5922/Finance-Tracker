import { logOutAction } from "@/features/auth/lib/actions/logout.action";
import { cn } from "@/shared/utilities";
import styles from "./LogoutButton.module.css";

interface Props {
  placement: "desktop-header" | "mobile-sidebar";
}

export default function LogoutButton({ placement }: Props) {
  return (
    <form
      action={logOutAction}
      className={cn(
        styles.form,
        placement === "desktop-header"
          ? styles.desktopHeader
          : styles.mobileSidebar,
      )}
    >
      <button type="submit" className={styles.button}>
        Log out
      </button>
    </form>
  );
}
