import { ReactElement } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";

interface LayoutProps {
  children: ReactElement;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Header />
      <main className="w-full bg-black text-white antialiased">{children}</main>
      <Footer />
    </>
  );
}
