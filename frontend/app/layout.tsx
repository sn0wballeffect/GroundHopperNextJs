import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Poppins } from "next/font/google";

const poppins_init = Poppins({
  subsets: ["latin"],
  weight: ["100", "400", "700", "500"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins_init.variable} antialiased font-poppins  bg-background`}
      >
        {children}
      </body>
    </html>
  );
}
