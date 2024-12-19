"use client";
/* import { Button } from "@/components/ui/button"; */
import { useState } from "react";
import { AuthDialog } from "./auth/AuthDialog";
/* import { useAuth } from "@/hooks/useAuth"; */
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { ChevronRight } from "lucide-react"; // Add this import at the top

export function NavBar() {
  /* const { user, signOut } = useAuth(); */
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const { open, setOpen } = useSidebar();

  return (
    <header className="flex items-center justify-between p-3 bg-transparent w-full">
      <nav className="flex items-center gap-4 ml-auto">
        <SidebarTrigger className="rotate-180" />

        {/*  {user ? (
          <>
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <Button variant="ghost" onClick={signOut}>
              Ausloggen
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" onClick={() => setShowSignIn(true)}>
              Anmelden
            </Button>
            <Button onClick={() => setShowSignUp(true)}>Registrieren</Button>
          </>
        )} */}
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
