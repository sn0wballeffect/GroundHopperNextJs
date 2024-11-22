import { Button } from "@/components/ui/button";
import Link from "next/link";
import grasshopper from "../assets/GrasshopperR.png";
import Image from "next/image";

export function NavBar() {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-transparent w-full">
      <Link href="/" className="">
        <Image
          src={grasshopper}
          alt="Grasshopper Logo"
          width={50}
          height={50}
        />
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
