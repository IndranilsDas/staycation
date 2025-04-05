// a// src/firebase/auth.js
// import { auth } from "./firebase";
// import {
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   signOut,
//   onAuthStateChanged,
// } from "firebase/auth";
// import admin from "firebase-admin";
// import serviceAccount from "./serviceAccountKey.json"; // Ensure you have this file downloaded

// // Initialize Firebase Admin SDK (Only on the server-side)
// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//   });
// }

// const adminAuth = admin.auth();

// // Function to check if a user exists by phone number (server-side only)
// export const checkUserExists = async (phoneNumber) => {
//   try {
//     const userRecord = await adminAuth.getUserByPhoneNumber(phoneNumber);
//     return userRecord ? true : false; // User exists
//   } catch (error) {
//     if (error.code === "auth/user-not-found") {
//       return false; // User does not exist
//     }
//     console.error("Error checking user existence:", error);
//     return false;
//   }
// };

// // Authentication functions
// export const signUp = async (email, password) => {
//   return await createUserWithEmailAndPassword(auth, email, password);
// };

// export const logIn = async (email, password) => {
//   return await signInWithEmailAndPassword(auth, email, password);
// };

// export const logOut = async () => {
//   return await signOut(auth);
// };

// export const authStateListener = (callback) => {
//   return onAuthStateChanged(auth, callback);
// };

import { auth, db } from "./firebase"; // Import Firestore instance
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
} from "firebase/firestore";

// ✅ Function to check if a user exists in Firestore
export const checkUserExists = async (phoneNumber) => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("phoneNumber", "==", phoneNumber));
    const querySnapshot = await getDocs(q);

    return !querySnapshot.empty; // True if user exists, false otherwise
  } catch (error) {
    console.error("Error checking user existence:", error);
    return false;
  }
};

// ✅ Sign Up User and Save to Firestore
export const signUpWithPhone = async (phoneNumber, otpConfirmation) => {
  try {
    const result = await otpConfirmation.confirm(otpCode);
    const user = result.user;

    // Save user details in Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      phoneNumber,
      createdAt: new Date(),
    });

    return user;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
};

// ✅ Send OTP for Login/Signup
export const sendOtp = async (phoneNumber) => {
  try {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
    });

    return await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
};

// ✅ Login with OTP (Verify)
export const verifyOtp = async (otpConfirmation, otpCode) => {
  try {
    const result = await otpConfirmation.confirm(otpCode);
    return result.user; // Returns logged-in user
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error;
  }
};

// ✅ Logout Function
export const logOut = async () => {
  return await signOut(auth);
};

// ✅ Listen to Auth State Changes
export const authStateListener = (callback) => {
  return onAuthStateChanged(auth, callback);
};


export async function signUpforUsers(email, password, role) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

                                                                             // Create Firestore profile with role
  await setDoc(doc(db, "users", user.uid), {
    email: user.email,
    role: "customer",  // e.g. "admin", "broker", "customer"
    createdAt: new Date(),
  });
}

export async function signUpforAdmins(email, password, role) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

                                                                             // Create Firestore profile with role
  await setDoc(doc(db, "users", user.uid), {
    email: user.email,
    role: "customer",  // e.g. "admin", "broker", "customer"
    createdAt: new Date(),
  });
}