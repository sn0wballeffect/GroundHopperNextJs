import { Footer } from "../../components/Footer";
import { NavBar } from "../../components/NavBar";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <div className="flex flex-col h-screen w-full">
        <div className="hidden md:block">
          <NavBar />
        </div>
        <main className="md:overflow-hidden">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
