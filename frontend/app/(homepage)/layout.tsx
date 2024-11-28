import { Footer } from "../../components/Footer";
import { NavBar } from "../../components/NavBar";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <div className="flex flex-col h-[100svh] w-full">
        <NavBar />
        <main className="md:overflow-hidden">{children}</main>
        <div className="hidden md:block">
          <Footer />
        </div>
      </div>
    </div>
  );
}
