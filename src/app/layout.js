"use client"
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider, useAuth } from "../lib/authcontext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SignupModal from "../components/sign-up";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function PrivateRoute({ children }) {
  const { user, role, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isSignupVisible, setIsSignupVisible] = useState(false);

  // Handle both URL hash and direct state changes for modal
  useEffect(() => {
    const handleHashChange = () => {
      setIsSignupVisible(window.location.hash === '#signup');
    };

    // Initial check
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Authentication and authorization logic
  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Show signup modal instead of redirecting
        setIsSignupVisible(true);
        
        // For protected routes, optionally redirect after modal close
        if (pathname.startsWith("/protected")) {
          window.signupRedirectPath = pathname;
        }
      } else if (pathname.startsWith("/admin") && role !== "admin") {
        router.push("/"); // Still redirect for admin routes
      }
    }
  }, [user, role, loading, pathname, router]);

  const handleSignupSuccess = (userData) => {
    setIsSignupVisible(false);
    // Handle post-signup redirect if needed
    if (window.signupRedirectPath) {
      router.push(window.signupRedirectPath);
      delete window.signupRedirectPath;
    }
  };

  const handleSignupClose = () => {
    setIsSignupVisible(false);
    // Redirect unauthenticated users from protected routes
    if (!user && pathname.startsWith("/protected")) {
      router.push("/");
    }
    // Clean URL
    window.history.replaceState(null, null, ' ');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      {children}
      <SignupModal
        isVisible={isSignupVisible}
        onClose={handleSignupClose}
        onSuccess={handleSignupSuccess}
        initialView={pathname.startsWith("/protected") ? "login" : "signup"}
      />
    </>
  );
}

export default function RootLayout({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <html lang="en" className={mounted ? "hydrated" : ""}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-white text-gray-900`}>
        <AuthProvider>
          <PrivateRoute>{children}</PrivateRoute>
        </AuthProvider>
      </body>
    </html>
  );
}