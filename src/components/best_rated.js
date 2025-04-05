"use client"

import { useRef, useState, useEffect } from "react"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"
import { CiHeart } from "react-icons/ci"
import { Prompt } from 'next/font/google'
import { fetchBestRated } from "../lib/firebase"
import Link from "next/link"

const prompt = Prompt({
  subsets: ["latin"],
  weight: ["200", "300", "400", "600", "800"],
})

const tabs = ["All", "Karjat", "Delhi", "Kasauli"]

export default function BestRated() {
  const scrollRef = useRef(null)
  const [selectedTab, setSelectedTab] = useState("All")
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState({})

  useEffect(() => {
    const getListings = async () => {
      setLoading(true)
      try {
        const data = await fetchBestRated(selectedTab)
        setListings(data)
      } catch (error) {
        console.error("Error fetching best rated listings:", error)
        // Fallback data
        setListings([
          {
            id: "fallback1",
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
        ])
      } finally {
        setLoading(false)
      }
    }

    getListings()
  }, [selectedTab])

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" })
  }

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" })
  }

  const toggleFavorite = (e, id) => {
    e.preventDefault() // Prevent navigation when clicking the favorite button
    e.stopPropagation() // Stop event from bubbling up
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  return (
    <section className={`${prompt.className} p-6 bg-white`}>
      {/* Heading + Tabs */}
      <div className="flex justify-between items-center px-16 mb-4">
        <h1 className="text-left font-semibold text-3xl text-black">Best Rated</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 px-16 mb-4 py-4 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-4 py-2 rounded-md transition ${
              selectedTab === tab
                ? "bg-black/50 text-white" // Active state style
                : "bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Scrollable Cards */}
      <div className="relative w-full">
        {/* Left Button */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 p-2 shadow-md rounded-full"
        >
          <FaChevronLeft />
        </button>

        {/* Cards */}
        <div ref={scrollRef} className="flex gap-4 overflow-clip py-2 scroll-smooth no-scrollbar px-16">
          {loading ? (
            <div className="flex justify-center items-center w-full p-10">
              <div className="animate-pulse">Loading best rated properties...</div>
            </div>
          ) : listings.length === 0 ? (
            <div className="flex justify-center items-center w-full p-10">
              <p>No properties found for this location.</p>
            </div>
          ) : (
            listings.map((listing) => (
              <Link
                key={listing.id}
                href={`/villas/${listing.id}`}
                className="cursor-pointer"
              >
                <div className="flex flex-col m-auto min-w-[280px] max-w-[280px] border rounded-lg ring ring-gray-300 shadow-xl bg-white hover:shadow-2xl transition-all duration-300">
                  {/* Image Container */}
                  <div className="relative">
                    <img
                      src={listing.image || "/placeholder.svg"}
                      alt={listing.name}
                      className="w-full h-[200px] object-cover"
                    />

                    {/* Rating */}
                    <div className="absolute top-2 left-2 bg-white text-black px-2 py-1 rounded-full text-sm">
                      ⭐ {listing.rating}
                    </div>

                    {/* Favorite Button */}
                    <button
                      onClick={(e) => toggleFavorite(e, listing.id)}
                      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                    >
                      <CiHeart
                        className={`text-xl ${favorites[listing.id] ? "text-red-500 fill-red-500" : "text-black"}`}
                      />
                    </button>

                    {/* Best Rated Badge */}
                    {listing.rating >= 4.8 && (
                      <div className="absolute bottom-2 left-2 bg-black text-white text-xs px-2 py-1 rounded">
                        Best Rated
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h2 className="font-semibold text-lg">{listing.name}</h2>
                    <p className="text-gray-500 text-sm mb-1">{listing.location}</p>
                    <p className="text-gray-500 text-sm h-10">
                      Upto {listing.guests} Guests • {listing.rooms} Rooms • {listing.baths} Baths
                    </p>

                    {/* Price */}
                    <div className="flex justify-between items-center mt-3">
                      <div>
                        <span className="text-lg font-semibold">{listing.price}</span>
                        {listing.oldPrice && <span className="text-gray-400 line-through ml-2">{listing.oldPrice}</span>}
                        <p className="text-gray-400 text-sm">For Per Night + Taxes</p>
                      </div>
                      <div className="bg-white border rounded-full p-2 shadow-md">
                        <FaChevronRight />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Right Button */}
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 p-2 shadow-md rounded-full"
        >
          <FaChevronRight />
        </button>
      </div>
    </section>
  )
}
