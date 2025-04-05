"use client"
import { useState, useEffect } from "react"
import { fetchCollections, fetchVillas } from "../lib/firebase"
import Link from "next/link"
import { Prompt } from "next/font/google"

const prompt = Prompt({
  subsets: ["latin"],
  weight: ["200", "300", "400", "600", "800"],
})

export default function CollectionCarousel() {
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch collections and villas
        const firebaseCollections = await fetchCollections()
        const villas = await fetchVillas()

        // Count villas per collection
        const villaCounts = villas.reduce((acc, villa) => {
          const collectionId = villa.collection
          if (collectionId) {
            acc[collectionId] = (acc[collectionId] || 0) + 1
          }
          return acc
        }, {})

        // Merge collections with villa count
        const formattedCollections = firebaseCollections.map(col => ({
          id: col.id,
          title: col.title,
          image: col.image,
          description: col.description,
          villaCount: villaCounts[col.id] || 0, // Use villa count if available
        }))

        setCollections(formattedCollections)
      } catch (err) {
        console.error("Failed to load collections:", err)
        setError("Failed to load collections.")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="w-full bg-white py-16 flex justify-center">
        <div className="animate-pulse text-lg">Loading collections...</div>
      </div>
    )
  }

  return (
    <div className={`w-full bg-white py-16 ${prompt.className}`}>
      <h2 className="font-semibold text-3xl mb-8 mx-4 md:mx-20 text-center md:text-left">
        Choose a Collection
      </h2>

      {error && (
        <div className="mx-4 md:mx-20 mb-4 p-4 bg-yellow-100 text-yellow-800 rounded">
          {error}
        </div>
      )}

      <div className="relative mx-4 md:mx-16">
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide px-4 pb-4">
          {collections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </div>
    </div>
  )
}

function CollectionCard({ collection }) {
  return (
    <Link
      href={`/collections/${collection.id}`}
      className="group relative min-w-[280px] md:min-w-[320px] h-80 bg-white rounded-lg shadow-lg
        overflow-clip cursor-pointer flex-shrink-0 transition-transform hover:scale-[1.02]"
    >
      <img 
        src={collection.image} 
        alt={collection.title} 
        className="w-full h-full object-cover" 
      />

      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 group-hover:backdrop-blur-sm transition-all duration-300 z-10" />

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 z-10">
        <h3 className={`text-xl font-semibold text-white ${prompt.className}`}>
          {collection.title}
        </h3>
        <p className="text-sm text-white/80">
          {collection.villaCount} {collection.villaCount === 1 ? 'villa' : 'villas'} available
        </p>
      </div>
    </Link>
  )
}
