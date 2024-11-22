import { Button } from "@/components/ui/button";
import Link from "next/link";

export function NavBar() {
  return (
    <header className="flex items-center justify-between p-4 bg-transparent w-full">
      <Link href="/"></Link>
      <nav className="flex items-center gap-4 ml-auto">
        <Link href="/signin">
          <Button variant="ghost">Login</Button>
        </Link>
        <Link href="/signup">
          <Button>Join Now</Button>
        </Link>
      </nav>
    </header>
  );
}
