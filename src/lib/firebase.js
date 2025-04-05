"use client"
import { initializeApp } from "firebase/app"
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { getAuth } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyADMl7HMQHusx1FN8tYAEDL6AhBeVd3F1g",
  authDomain: "staycation-test.firebaseapp.com",
  projectId: "staycation-test",
  storageBucket: "staycation-test.firebasestorage.app",
  messagingSenderId: "403901865838",
  appId: "1:403901865838:web:453aa64d217c6dacf52b7f",
  measurementId: "G-8NZP9KVSZ2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app);


export { auth };

// Dynamically import Firebase Analytics only when running in the browser
if (typeof window !== "undefined") {
  import("firebase/analytics")
    .then(({ getAnalytics }) => {
      const analytics = getAnalytics(app)
      // You can now use analytics as needed
    })
    .catch((error) => {
      console.error("Failed to load Firebase Analytics:", error)
    })
}

const db = getFirestore(app)
const storage = getStorage(app)

// Collection references
const collectionsRef = collection(db, "collections")
const bestRatedRef = collection(db, "bestRated")
const featuresRef = collection(db, "features")
const destinationsRef = collection(db, "destinations")
const trendingRef = collection(db, "trending")
const starsRef = collection(db, "stars")
const slidesRef = collection(db, "slides")
const offersRef = collection(db, "offers")
const villasRef = collection(db, "villas")
const bookingsRef = collection(db, "bookings")

// Collections functions
export const fetchCollections = async () => {
  try {
    console.log("[Firebase] Fetching collections...");
    const snapshot = await getDocs(collectionsRef);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("[Firebase] Error fetching collections:", error);
    return [];
  }
};

export const fetchVillas = async () => {
  try {
    console.log("[Firebase] Fetching villas...");
    const snapshot = await getDocs(villasRef);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("[Firebase] Error fetching villas:", error);
    return [];
  }
};

export const fetchVillaById = async (villaId) => {
  try {
    return await fetchVilla(villaId)
  } catch (error) {
    console.error("Error fetching villa by ID:", error)
    return null
  }
}

export const fetchCollectionById = async (collectionId) => {
  try {
    console.log(`[Firebase] Fetching collection with ID: ${collectionId}`)
    const docRef = doc(collectionsRef, collectionId)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      const collectionData = {
        id: docSnap.id,
        ...docSnap.data()
      }
      console.log("[Firebase] Collection found:", collectionData)
      return collectionData
    } else {
      console.log("[Firebase] No such collection found")
      return null
    }
  } catch (error) {
    console.error("[Firebase] Error fetching collection:", error)
    return null
  }
}

export const fetchVillasByCollection = async (collectionId) => {
  try {
    const q = query(villasRef, where("collection", "==", collectionId))
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error("Error fetching villas by collection:", error)
    return []
  }
}

export const fetchBestRated = async (category = null) => {
  try {
    let q

    if (category && category !== "All") {
      q = query(villasRef, where("location", "==", category), orderBy("rating", "desc"), limit(10))
    } else {
      q = query(villasRef, orderBy("rating", "desc"), limit(10))
    }

    const snapshot = await getDocs(q)

    return snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        name: data.villaName,
        location: data.location,
        guests: Number.parseInt(data.maxGuests),
        rooms: Number.parseInt(data.rooms),
        baths: Number.parseInt(data.baths),
        rating: Number.parseFloat(data.rating),
        price: `₹${Number.parseInt(data.discountedPrice).toLocaleString("en-IN")}`,
        oldPrice: data.originalPrice ? `₹${Number.parseInt(data.originalPrice).toLocaleString("en-IN")}` : null,
        image: data.heroImages && data.heroImages.length > 0 ? data.heroImages[0].url : "/placeholder.svg",
        category: data.location.split(",")[0].trim(),
      }
    })
  } catch (error) {
    console.error("Error fetching best rated:", error)
    return []
  }
}

export const fetchTrending = async (location = null) => {
  try {
    const threeMonthsAgo = new Date()
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
    const threeMonthsAgoTimestamp = Timestamp.fromDate(threeMonthsAgo)

    const bookingsQuery = query(bookingsRef, where("bookingDate", ">=", threeMonthsAgoTimestamp))
    const bookingsSnapshot = await getDocs(bookingsQuery)

    const villaBookingCounts = {}
    bookingsSnapshot.docs.forEach((doc) => {
      const data = doc.data()
      const villaId = data.villaId

      if (villaBookingCounts[villaId]) {
        villaBookingCounts[villaId]++
      } else {
        villaBookingCounts[villaId] = 1
      }
    })

    const sortedVillaIds = Object.keys(villaBookingCounts).sort((a, b) => villaBookingCounts[b] - villaBookingCounts[a])
    const topVillaIds = sortedVillaIds.slice(0, 10)

    if (topVillaIds.length === 0) {
      let q
      if (location && location !== "All" && location !== "Explore more") {
        q = query(villasRef, where("location", "==", location), orderBy("rating", "desc"), limit(10))
      } else {
        q = query(villasRef, orderBy("rating", "desc"), limit(10))
      }

      const snapshot = await getDocs(q)

      return snapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          id: doc.id,
          title: data.villaName,
          location: data.location,
          guests: Number.parseInt(data.maxGuests),
          rooms: Number.parseInt(data.rooms),
          baths: Number.parseInt(data.baths),
          rating: Number.parseFloat(data.rating),
          price: `₹${Number.parseInt(data.discountedPrice).toLocaleString("en-IN")}`,
          originalPrice: data.originalPrice ? `₹${Number.parseInt(data.originalPrice).toLocaleString("en-IN")}` : null,
          image: data.heroImages && data.heroImages.length > 0 ? data.heroImages[0].url : "/placeholder.svg",
          bookingCount: 0,
        }
      })
    }

    const trendingVillas = []

    for (const villaId of topVillaIds) {
      const villaDoc = await getDoc(doc(db, "villas", villaId))

      if (villaDoc.exists()) {
        const data = villaDoc.data()

        if (location && location !== "All" && location !== "Explore more" && !data.location.includes(location)) {
          continue
        }

        trendingVillas.push({
          id: villaDoc.id,
          title: data.villaName,
          location: data.location,
          guests: Number.parseInt(data.maxGuests),
          rooms: Number.parseInt(data.rooms),
          baths: Number.parseInt(data.baths),
          rating: Number.parseFloat(data.rating),
          price: `₹${Number.parseInt(data.discountedPrice).toLocaleString("en-IN")}`,
          originalPrice: data.originalPrice ? `₹${Number.parseInt(data.originalPrice).toLocaleString("en-IN")}` : null,
          image: data.heroImages && data.heroImages.length > 0 ? data.heroImages[0].url : "/placeholder.svg",
          bookingCount: villaBookingCounts[villaId],
        })
      }
    }

    return trendingVillas
  } catch (error) {
    console.error("Error fetching trending:", error)
    return []
  }
}

export const fetchFeatures = async () => {
  try {
    const snapshot = await getDocs(featuresRef)
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error("Error fetching features:", error)
    return []
  }
}

export const fetchDestinations = async () => {
  try {
    const snapshot = await getDocs(destinationsRef)
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error("Error fetching destinations:", error)
    return []
  }
}

export const fetchStars = async () => {
  try {
    const snapshot = await getDocs(starsRef)
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error("Error fetching stars:", error)
    return []
  }
}

export const fetchSlides = async () => {
  try {
    const snapshot = await getDocs(slidesRef)
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error("Error fetching slides:", error)
    return []
  }
}

export const fetchOffers = async (type = null) => {
  try {
    let q = offersRef

    if (type && type !== "All") {
      const offerType = type === "Bank offers" ? "bank_offer" : "stayvista_offer"
      q = query(offersRef, where("type", "==", offerType))
    }

    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error("Error fetching offers:", error)
    return []
  }
}

// Villa specific functions
export const saveVilla = async (villaData) => {
  try {
    const docRef = await addDoc(villasRef, villaData)
    return { id: docRef.id, ...villaData }
  } catch (error) {
    console.error("Error saving villa:", error)
    throw error
  }
}

export const updateVilla = async (villaId, villaData) => {
  try {
    const villaRef = doc(db, "villas", villaId)
    await updateDoc(villaRef, villaData)
    return { id: villaId, ...villaData }
  } catch (error) {
    console.error("Error updating villa:", error)
    throw error
  }
}

export const fetchVilla = async (villaId) => {
  try {
    const villaRef = doc(db, "villas", villaId)
    const villaSnap = await getDoc(villaRef)

    if (villaSnap.exists()) {
      return { id: villaSnap.id, ...villaSnap.data() }
    } else {
      console.log("No such villa!")
      return null
    }
  } catch (error) {
    console.error("Error fetching villa:", error)
    throw error
  }
}

export const fetchAllVillas = async () => {
  try {
    const snapshot = await getDocs(villasRef)
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error("Error fetching villas:", error)
    return []
  }
}

export const deleteVilla = async (villaId) => {
  try {
    const villaRef = doc(db, "villas", villaId)
    await deleteDoc(villaRef)
    return true
  } catch (error) {
    console.error("Error deleting villa:", error)
    throw error
  }
}

// Booking functions
export const createBooking = async (bookingData) => {
  try {
    if (!bookingData.bookingDate) {
      bookingData.bookingDate = Timestamp.now()
    }

    const docRef = await addDoc(bookingsRef, bookingData)
    return { id: docRef.id, ...bookingData }
  } catch (error) {
    console.error("Error creating booking:", error)
    throw error
  }
}

export const fetchBookingsForVilla = async (villaId) => {
  try {
    const q = query(bookingsRef, where("villaId", "==", villaId))
    const snapshot = await getDocs(q)

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error("Error fetching bookings for villa:", error)
    return []
  }
}

export const fetchRecentBookings = async (months = 3) => {
  try {
    const monthsAgo = new Date()
    monthsAgo.setMonth(monthsAgo.getMonth() - months)
    const monthsAgoTimestamp = Timestamp.fromDate(monthsAgo)

    const q = query(bookingsRef, where("bookingDate", ">=", monthsAgoTimestamp), orderBy("bookingDate", "desc"))

    const snapshot = await getDocs(q)

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error("Error fetching recent bookings:", error)
    return []
  }
}

export async function fetchVillaLocations() {
  try {
    const querySnapshot = await getDocs(collection(db, "villas"));
    const locations = [];
    querySnapshot.forEach((doc) => {
      const villaData = doc.data();
      if (villaData.location) {
        locations.push(villaData.location);
      }
    });
    return locations;
  } catch (error) {
    console.error("Error fetching villa locations:", error);
    return [];
  }
}

export const saveCollection = async (collectionData) => {
  try {
    // Create a reference to the "collections" collection
    const collectionsRef = collection(db, "collections")
    const docRef = await addDoc(collectionsRef, collectionData)
    return { id: docRef.id, ...collectionData }
  } catch (error) {
    console.error("Error saving collection:", error)
    throw error
  }
}

// Upload image to Firebase Storage
export const uploadImage = async (file, path) => {
  console.log("inside image upload");
  
  try {
    const storageRef = ref(storage, path)
    const snapshot = await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(snapshot.ref)
    console.log(storageRef, snapshot, downloadURL);
    
    return downloadURL
  } catch (error) {
    console.error("Error uploading image:", error)
    throw error
  }
}

export const deleteCollection = async (collectionId) => {
  try {
    console.log(`[Firebase] Deleting collection with ID: ${collectionId}`)
    const collectionRef = doc(db, "collections", collectionId)

    // First check if the collection exists
    const collectionSnap = await getDoc(collectionRef)

    if (!collectionSnap.exists()) {
      console.error(`[Firebase] Collection with ID ${collectionId} does not exist`)
      throw new Error("Collection not found")
    }

    // Delete the collection document
    await deleteDoc(collectionRef)
    console.log(`[Firebase] Successfully deleted collection with ID: ${collectionId}`)
    return true
  } catch (error) {
    console.error("[Firebase] Error deleting collection:", error)
    throw error
  }
}

export { db, storage }