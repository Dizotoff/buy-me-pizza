import { Dialog } from "@headlessui/react";
import { ReactElement } from "react";

interface ModalProps {
  onClose: () => void;
  open: boolean;
  children: ReactElement;
}

export const Modal = ({
  open,
  onClose,
  children,
}: ModalProps): ReactElement => {
  return (
    <>
      <Dialog open={open} onClose={onClose} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto flex max-w-sm flex-col gap-6 rounded bg-white p-6 ">
            {children}
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};
