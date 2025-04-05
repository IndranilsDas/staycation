"use client"
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider, useAuth } from "../lib/authcontext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Removed metadata export as it is incompatible with "use client"

function PrivateRoute({ children }) {
  const { user, role, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/sign-in"); // Redirect to login if not authenticated
      } else if (pathname.startsWith("/admin") && role !== "admin") {
        router.push("/"); // Redirect to home if not admin
      }
      console.log("User:", user);
      console.log("Role:", role);
    }
  }, [user, role, loading, pathname, router]);

  if (loading) return <div>Loading...</div>; // Show loading state

  return children;
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <PrivateRoute>{children}</PrivateRoute>
        </AuthProvider>
      </body>
    </html>
  );
}
