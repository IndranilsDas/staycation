// This file is for reference only - it shows how to seed the Firebase database with initial data

import { db } from "./firebase"
import { collection, addDoc } from "firebase/firestore"

// Example function to seed collections data
async function seedCollections() {
  const collections = [
    {
      title: "Newly Launched",
      image: "/images/collections_sunset.jpg",
      description: "Heavenly villas in picturesque locations for your fairytale destination wedding.",
    },
    {
      title: "Romantic Getaways",
      image: "/images/collections_romantic.jpg",
      description: "Heavenly villas in picturesque locations for your fairytale destination wedding.",
    },
    {
      title: "Villas For Weddings",
      image: "/images/collections_weddings.jpg",
      description: "Heavenly villas in picturesque locations for your fairytale destination wedding.",
    },
    {
      title: "VEO by StayVista",
      image: "/images/collections_pool.webp",
      description: "Heavenly villas in picturesque locations for your fairytale destination wedding.",
    },
    {
      title: "Introducing Residences",
      image: "/images/collections_getaways.jpg",
      description: "Heavenly villas in picturesque locations for your fairytale destination wedding.",
    },
  ]

  const collectionsRef = collection(db, "collections")

  for (const item of collections) {
    try {
      await addDoc(collectionsRef, item)
      console.log(`Added collection: ${item.title}`)
    } catch (error) {
      console.error(`Error adding collection ${item.title}:`, error)
    }
  }
}

// Example function to seed best rated listings
async function seedBestRated() {
  const listings = [
    {
      name: "Two Villa",
      location: "Karjat, Maharashtra",
      guests: 9,
      rooms: 3,
      baths: 3,
      rating: 4.6,
      price: "₹12,860",
      oldPrice: "₹15,000",
      image: "/images/places/karjat2.jpg",
      category: "Karjat",
    },
    {
      name: "Arhaan Farm",
      location: "New Delhi, Delhi",
      guests: 15,
      rooms: 5,
      baths: 5,
      rating: 4.9,
      price: "₹33,445",
      oldPrice: "₹37,050",
      image: "/images/places/delhi.jpg",
      category: "Delhi",
    },
    {
      name: "Basalt",
      location: "Karjat, Maharashtra",
      guests: 15,
      rooms: 5,
      baths: 7,
      rating: 4.8,
      price: "₹24,175",
      oldPrice: "₹27,000",
      image: "/images/places/karjat.jpg",
      category: "Karjat",
    },
    {
      name: "Cedar Haven - Nahan",
      location: "Kasauli, Himachal Pradesh",
      guests: 15,
      rooms: 5,
      baths: 5,
      rating: 4.8,
      price: "₹24,175",
      oldPrice: "₹26,750",
      image: "/images/places/himachal.jpg",
      category: "Kasauli",
    },
  ]

  const bestRatedRef = collection(db, "bestRated")

  for (const item of listings) {
    try {
      await addDoc(bestRatedRef, item)
      console.log(`Added best rated listing: ${item.name}`)
    } catch (error) {
      console.error(`Error adding best rated listing ${item.name}:`, error)
    }
  }
}

// Run the seed functions
// seedCollections();
// seedBestRated();
// Add more seed functions for other collections

