import { Footer } from "../../components/Footer";
import { NavBar } from "../../components/NavBar";
import AnimatedText from "./_components/animatedText";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <div className="flex flex-col h-screen w-full">
        <div className="hidden lg:block">
          <NavBar />
        </div>
        <main className="md:overflow-hidden">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
