import { NavBar } from "@/components/NavBar";
import { Footer } from "../../components/Footer";

export default function SearchLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <div className="flex flex-col h-screen">
        <NavBar />
        <main className="flex-1 md:overflow-hidden">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
