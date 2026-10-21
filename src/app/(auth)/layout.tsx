"use client";

import { SessionProvider } from "next-auth/react";
import { FirebaseProvider } from "@/components/firebase/firebase-provider";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <FirebaseProvider>
        <div className="relative flex min-h-screen flex-col items-center justify-center bg-background p-4 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[680px] h-[340px] bg-gradient-to-r from-[#1D39C4]/15 via-[#6D28D9]/15 to-[#A824B4]/15 blur-[120px] rounded-full pointer-events-none -z-10" />
          {children}
        </div>
      </FirebaseProvider>
    </SessionProvider>
  );
}
