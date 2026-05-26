"use client";

import { signOut } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import MobileNav from "./mobile-nav";

export default function Header() {
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border/60 bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:px-6">
      <div className="flex items-center gap-3">
        <MobileNav />
        <div>
          <h1 className="text-lg font-semibold md:hidden">SmartLedger</h1>
          <p className="hidden text-sm text-muted-foreground md:block">
            Welcome back
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">

        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          disabled={isSigningOut}
        >
          {isSigningOut ? (
            <>
              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
              Signing out...
            </>
          ) : (
            "Logout"
          )}
        </Button>
      </div>
    </header>
  );
}
