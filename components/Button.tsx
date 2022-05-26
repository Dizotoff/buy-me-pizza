import { MouseEventHandler, ReactElement } from "react";

export const Button = ({
  children,
  onClick,
  disabled,
}: {
  children: string;
  disabled?: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="rounded-sm bg-primary-500 px-3 py-2 text-sm font-bold text-white sm:py-3 sm:px-5 sm:text-base"
    >
      {children}
    </button>
  );
};
