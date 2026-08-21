import { Modal } from "@dhua5922/react-kit";
import type { ComponentProps, ReactNode } from "react";

interface Props extends ComponentProps<typeof Modal> {
  children?: ReactNode;
  headerChildren?: ReactNode;
  footerChildren?: ReactNode;
}

export default function MyModal({
  children,
  headerChildren,
  footerChildren,
  ...props
}: Props) {
  return (
    <Modal
      className="w-[min(92vw,28rem)] rounded-2xl border border-slate-200 bg-white p-0 shadow-2xl"
      {...props}
    >
      <Modal.Header className="flex items-start justify-between border-b border-slate-200 p-6">
        {headerChildren}
        <Modal.CloseButton className="rounded-md border border-slate-200 bg-white px-2 py-1 text-slate-600 hover:bg-slate-100" />
      </Modal.Header>

      <Modal.Body className="p-6">{children}</Modal.Body>

      <Modal.Footer className="flex items-center justify-between border-t border-slate-200 bg-slate-50 p-6">
        {footerChildren}
      </Modal.Footer>
    </Modal>
  );
}
