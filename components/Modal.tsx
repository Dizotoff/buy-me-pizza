import { Dialog, Transition } from "@headlessui/react";
import { Fragment, ReactElement } from "react";

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
      <Transition show={open} as={Fragment}>
        <Dialog open={open} onClose={onClose} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/95" aria-hidden="true" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="mx-auto flex max-w-sm flex-col gap-6 rounded bg-[#11141F] p-6 ">
                <div className="flex flex-col gap-6">{children}</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
