import { Footer } from "./_components/Footer";
import { NavBar } from "./_components/NavBar";

export default function RootLayout({
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
