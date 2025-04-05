"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

const LoginModal = ({ isVisible, onClose, onOpenSignup }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if the user is an admin
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists() && userDoc.data().role === "admin") {
        // Redirect to admin dashboard
        router.push("/admin/hero-form");
      } else {
        setSubmitError("Unauthorized access. Not an admin account.");
      }
    } catch (error) {
      console.error(error);
      setSubmitError("Invalid email or password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignupClick = () => {
    onClose();
    onOpenSignup();
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-50 transition-opacity duration-300 ${
        isVisible ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 sm:w-96 relative">
        <h2 className="text-lg font-semibold text-center">Welcome to StayVista</h2>
        <h3 className="text-xl font-bold text-center mt-2">Login</h3>

        {submitError && (
          <div className="mt-2 text-sm text-red-600 text-center">{submitError}</div>
        )}

        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              placeholder="********"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            onClick={handleSignupClick}
            className="text-sm text-blue-500 hover:underline"
          >
            Don't have an account? Sign up
          </button>
        </div>

        <div className="text-center mt-2">
          <button className="text-sm text-blue-500 hover:underline">
            Forgot password?
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          By logging in, you agree to our{" "}
          <a href="#" className="text-blue-500">
            Terms & Conditions
          </a>{" "}
          and{" "}
          <a href="#" className="text-blue-500">
            Privacy Policy
          </a>
        </p>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-xl font-bold text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default LoginModal;