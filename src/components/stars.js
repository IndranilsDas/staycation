"use client"

import { useRef, useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Prompt } from "next/font/google"
import { fetchStars } from "../lib/firebase"

const prompt = Prompt({
  subsets: ["latin"],
  weight: ["200", "300", "400", "600", "800"],
})

export default function StayLikeStars() {
  const scrollRef = useRef(null)
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getStars = async () => {
      setLoading(true)
      try {
        const data = await fetchStars()
        setListings(data)
      } catch (error) {
        console.error("Error fetching stars:", error)
        setListings([
          {
            name: "Vijay Deverakonda",
            location: "The Waterwillow",
            image: "/images/vijay.jpg",
          },
          {
            name: "Ananya Panday",
            location: "Villa Amarillo",
            image: "/images/ananya.jpg",
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    getStars()
  }, [])

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" })
    }
  }

  return (
    <section className={`${prompt.className} p-6 bg-white`}>
      <div className="flex justify-between items-center px-16 mb-4">
        <h1 className="text-left font-semibold text-3xl text-black">Stay like the stars</h1>
      </div>

      <div className="relative w-full">
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 p-2 shadow-md rounded-full cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-clip scroll-smooth py-2 no-scrollbar mx-16"
        >
          {loading ? (
            <div className="flex justify-center items-center w-full p-10">
              <div className="animate-pulse">Loading celebrity stays...</div>
            </div>
          ) : (
            listings.map((listing, index) => (
              <div
                key={index}
                className="flex flex-col min-w-[220px] max-w-[220px] border rounded-lg shadow-xl ring ring-gray-300 bg-white overflow-clip"
              >
                <div className="relative">
                  <img
                    src={listing.image || "/placeholder.svg"}
                    alt={listing.name}
                    className="w-full h-[220px] object-cover"
                  />
                </div>
                <div className="p-3">
                  <h2 className="text-md text-black">{listing.name}</h2>
                  <p className="text-gray-500 text-sm mb-2 h-10">{listing.location}</p>
                  <button className="w-full border border-gray-300 rounded-md text-black hover:bg-gray-100 transition">
                    View
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 p-2 shadow-md rounded-full cursor-pointer"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  )
}
