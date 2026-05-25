"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="flex items-center justify-between border-b px-6 py-4">
      <h1 className="text-xl font-semibold">SmartLedger</h1>

      <div className="flex items-center gap-4">
        <div className="text-sm text-muted-foreground">Welcome back</div>
        <Button variant="ghost" onClick={() => signOut({ callbackUrl: "/login" })}>
          Logout
        </Button>
      </div>
    </header>
  );
}