import { NavBar } from "./_components/NavBar";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <NavBar />
      {children}
    </div>
  );
}
