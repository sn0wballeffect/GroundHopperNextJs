import { Footer } from "../../components/Footer";
import { NavBar } from "../../components/NavBar";
import AnimatedText from "./_components/animatedBackground";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <div className="flex flex-col h-screen">
        <NavBar />
        <main className="flex-1 flex flex-col md:overflow-hidden">
          <div>
            <AnimatedText />
            {children}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
