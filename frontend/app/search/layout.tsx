import { NavBar } from "@/components/NavBar";
import { Footer } from "../../components/Footer";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function SearchLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarProvider>
      <div className="w-full">
        <div className="flex flex-col h-screen">
          <div className="hidden 2xl:block">
            <NavBar />
          </div>

          <main className="flex-1 md:overflow-hidden">{children}</main>

          <div className="hidden 2xl:block">
            <Footer />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
