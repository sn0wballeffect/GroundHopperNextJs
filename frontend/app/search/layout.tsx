import { NavBar } from "@/components/NavBar";
import { Footer } from "../../components/Footer";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function SearchLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <div className="flex flex-col h-screen">
        <div className="hidden 2xl:block">
          <NavBar />
        </div>
        <SidebarProvider>
          <main className="flex-1 md:overflow-hidden">{children}</main>
        </SidebarProvider>
        <div className="hidden 2xl:block">
          <Footer />
        </div>
      </div>
    </div>
  );
}
