import type { Metadata } from "next";
import {
  Inter,
  Major_Mono_Display,
  Noto_Kufi_Arabic,
  Roboto,
} from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import Header from "@/components/header/Header";
import Footer from "@/components/Footer";

//! الخط
// const inter = Inter({ subsets: ["latin"] });
// const major = Major_Mono_Display({ subsets: ["latin"], weight: ["400"] });
// const arap = Noto_Kufi_Arabic({ subsets: ["arabic"], weight: ["300"] });
const ropo = Roboto({ subsets: ["latin"], weight: ["500", "700", "900"] });

//! METADATA
export const metadata: Metadata = {
  title: "CLoud Hosting",
  description: "CLoud Hosting Project",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={ropo.className}>
        <Header />
        <ToastContainer theme="colored" position="top-center" />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
