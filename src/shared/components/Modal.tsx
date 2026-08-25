import { Modal } from "@dhua5922/react-kit";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "../utilities/css.utilities";

interface Props extends ComponentProps<typeof Modal> {
  children?: ReactNode;
  headerChildren?: ReactNode;
  footerChildren?: ReactNode;
}

export default function MyModal({
  children,
  headerChildren,
  footerChildren,
  className,
  ...props
}: Props) {
  return (
    <Modal
      className={cn(
        "w-[min(92vw,28rem)] rounded-2xl border border-border bg-surface p-0 text-foreground shadow-2xl",
        className,
      )}
      {...props}
    >
      <Modal.Header className="flex items-start justify-between border-b border-border p-6">
        {headerChildren}
        <Modal.CloseButton className="rounded-md border border-border bg-surface px-2 py-1 text-muted-foreground hover:bg-surface-muted hover:text-foreground" />
      </Modal.Header>

      <Modal.Body className="p-6">{children}</Modal.Body>

      <Modal.Footer className="flex items-center justify-between border-t border-border bg-surface-muted p-6">
        {footerChildren}
      </Modal.Footer>
    </Modal>
  );
}
