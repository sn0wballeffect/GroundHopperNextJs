import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import SupabaseProvider from "./providers/supabase-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/App-Sidebar";

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
      <body className="h-screen overflow-hidden bg-background font-inter antialiased">
        <SidebarProvider>
          <div className="h-full w-full">
            <main className="h-full w-full overflow-y-auto">
              <SupabaseProvider>{children}</SupabaseProvider>
            </main>
            <AppSidebar />
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
