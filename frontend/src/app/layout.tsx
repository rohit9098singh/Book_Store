import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/app/component/Header/Header";
import Footer from "@/app/component/Footer/Footer";
import LayoutWrapper from "./LayoutWrapper";



const roboto_mono = Roboto_Mono({
  subsets: ["latin"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "Book kart",
  description: "Ecommerce Platform For buying And Selling Of the Books",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={roboto_mono.className}
      >
        <LayoutWrapper>
          {/* <Header /> */}
          {children}
          {/* <Footer /> */}
        </LayoutWrapper>
      </body>
    </html>
  );
}
