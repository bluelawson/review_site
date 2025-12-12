"use client";
import { AuthProvider } from "@/context/AuthContext";
import { ReviewProvider } from "@/context/ReviewContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ReviewProvider>{children}</ReviewProvider>
    </AuthProvider>
  );
}
