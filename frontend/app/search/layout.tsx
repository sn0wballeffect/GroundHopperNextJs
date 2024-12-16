import { NavBar } from "@/components/NavBar";
import { Footer } from "../../components/Footer";

export default function SearchLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <div className="flex flex-col h-screen">
        <div className="hidden xl:block">
          <NavBar />
        </div>
        <main className="flex-1 md:overflow-hidden">{children}</main>
        <div className="hidden xl:block">
          <Footer />
        </div>
      </div>
    </div>
  );
}
