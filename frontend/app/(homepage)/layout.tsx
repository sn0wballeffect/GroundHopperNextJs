import { Footer } from "../../components/Footer";
import { NavBar } from "../../components/NavBar";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex flex-col min-h-screen h-[100svh] w-full">
      <NavBar />
      <main className="flex-1 md:overflow-hidden">{children}</main>
      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
}
