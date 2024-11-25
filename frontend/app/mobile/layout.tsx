export default function SearchLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <div className="flex flex-col h-screen">
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
