import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BiFootball } from "react-icons/bi";

export function NavBar() {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-transparent w-full">
      <Link href="/" className="">
        <BiFootball className="h-10 w-10" />
      </Link>
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
