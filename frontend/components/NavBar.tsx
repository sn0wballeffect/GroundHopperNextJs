"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import grasshopper from "../assets/GrasshopperR.png";
import { useState } from "react";
import { AuthDialog } from "./auth/AuthDialog";
import { useAuth } from "@/hooks/useAuth";

export function NavBar() {
  const { user, signOut } = useAuth();
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-transparent w-full">
      <Link href="/">
        <Image
          src={grasshopper}
          alt="Grasshopper Logo"
          width={50}
          height={50}
        />
      </Link>
      <nav className="flex items-center gap-4 ml-auto">
        {user ? (
          <>
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <Button variant="ghost" onClick={signOut}>
              Ausloggen
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" onClick={() => setShowSignIn(true)}>
              Login
            </Button>
            <Button onClick={() => setShowSignUp(true)}>Join Now</Button>
          </>
        )}
      </nav>

      <AuthDialog
        mode="signin"
        isOpen={showSignIn}
        onClose={() => setShowSignIn(false)}
      />
      <AuthDialog
        mode="signup"
        isOpen={showSignUp}
        onClose={() => setShowSignUp(false)}
      />
    </header>
  );
}
