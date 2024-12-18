import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import SupabaseProvider from "./providers/supabase-provider";

const inter_init = Inter({
  subsets: ["latin"],
  weight: ["100", "400", "700", "500"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Hoply",
  description: "Finde Sportevents in deiner Nähe",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </head>
      <body
        className={`${inter_init.variable} antialiased font-inter bg-background`}
      >
        <SupabaseProvider>{children}</SupabaseProvider>
      </body>
    </html>
  );
}
