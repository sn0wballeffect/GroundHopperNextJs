import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import SupabaseProvider from "./providers/supabase-provider";
import { SidebarProvider } from "@/components/ui/sidebar";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "400", "500", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hoply",
  description: "Finde Sportevents in deiner Nähe",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={inter.variable}>
      <body className="flex min-h-screen w-full flex-col bg-background font-inter antialiased">
        <SidebarProvider>
          <SupabaseProvider>{children}</SupabaseProvider>
        </SidebarProvider>
      </body>
    </html>
  );
}
