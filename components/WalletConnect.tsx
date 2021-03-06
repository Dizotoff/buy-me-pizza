import { useWallet } from "@solana/wallet-adapter-react";
import {
  useWalletModal,
  WalletConnectButton,
  WalletIcon,
  WalletModalButton,
} from "@solana/wallet-adapter-react-ui";
import Link from "next/link";
import React, {
  FC,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useCookies } from "react-cookie";
import { useGetUser, useLogout } from "../context/AuthProvider";
import { supabase } from "../utils/supabaseClient";

export const WalletMultiButton: FC<ButtonProps> = ({ children, ...props }) => {
  const { publicKey, wallet } = useWallet();
  const { setVisible } = useWalletModal();
  const logout = useLogout();
  const user = useGetUser();
  const [copied, setCopied] = useState(false);
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLUListElement>(null);
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);

  const base58 = useMemo(() => publicKey?.toBase58(), [publicKey]);
  const content = useMemo(() => {
    if (children) return children;
    if (!wallet || !base58) return null;
    return base58.slice(0, 4) + ".." + base58.slice(-4);
  }, [children, wallet, base58]);

  const copyAddress = useCallback(async () => {
    if (base58) {
      await navigator.clipboard.writeText(base58);
      setCopied(true);
      setTimeout(() => setCopied(false), 400);
    }
  }, [base58]);

  const openDropdown = useCallback(() => {
    setActive(true);
  }, []);

  const closeDropdown = useCallback(() => {
    setActive(false);
  }, []);

  const openModal = useCallback(() => {
    setVisible(true);
    closeDropdown();
  }, [closeDropdown]);

  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const node = ref.current;

      // Do nothing if clicking dropdown or its descendants
      if (!node || node.contains(event.target as Node)) return;

      closeDropdown();
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, closeDropdown]);

  if (!wallet)
    return <WalletModalButton {...props}>{children}</WalletModalButton>;
  if (!base58)
    return <WalletConnectButton {...props}>{children}</WalletConnectButton>;

  return (
    <div className="wallet-adapter-dropdown">
      <Button
        aria-expanded={active}
        className="wallet-adapter-button-trigger"
        //@ts-ignore
        style={{ pointerEvents: active ? "none" : "auto", ...props.style }}
        onClick={openDropdown}
        startIcon={<WalletIcon wallet={wallet} />}
        {...props}
      >
        {content}
      </Button>
      <ul
        aria-label="dropdown-list"
        className={`wallet-adapter-dropdown-list ${
          active && "wallet-adapter-dropdown-list-active"
        }`}
        ref={ref}
        role="menu"
      >
        {user?.username && (
          <Link href={`/${user?.username}`}>
            <li className="wallet-adapter-dropdown-list-item" role="menuitem">
              My page
            </li>
          </Link>
        )}

        <li
          onClick={() => logout()}
          className="wallet-adapter-dropdown-list-item"
          role="menuitem"
        >
          Disconnect
        </li>
      </ul>
    </div>
  );
};

export interface ButtonProps {
  className?: string;
  disabled?: boolean;
  endIcon?: ReactElement;
  onClick?: () => void;
  startIcon?: ReactElement;
  tabIndex?: number;
  children?: any;
}

export const Button: FC<ButtonProps> = (props) => {
  return (
    <button
      className={`wallet-adapter-button ${props.className || ""}`}
      disabled={props.disabled}
      onClick={props.onClick}
      tabIndex={props.tabIndex || 0}
      type="button"
    >
      {props.startIcon && (
        <i className="wallet-adapter-button-start-icon">{props.startIcon}</i>
      )}
      {props.children}
      {props.endIcon && (
        <i className="wallet-adapter-button-end-icon">{props.endIcon}</i>
      )}
    </button>
  );
};
