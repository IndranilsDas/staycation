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
    scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" })
  }

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" })
  }

  const toggleFavorite = (e, id) => {
    e.preventDefault()
    e.stopPropagation()
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  return (
    <section className={`${prompt.className} bg-white py-16 px-4 md:px-20`}>
      {/* Heading */}
      <h2 className="font-semibold text-3xl mb-4 text-center md:text-left">Best Rated</h2>

      {/* Tabs */}
      <div className="flex gap-3 overflow-x-auto scrollbar-hide mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-4 py-2 whitespace-nowrap rounded-full transition text-sm ${
              selectedTab === tab
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Carousel */}
      <div className="relative">
        {/* Scroll Left */}
        <button
          onClick={scrollLeft}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 p-2 shadow-md rounded-full"
        >
          <FaChevronLeft />
        </button>

        {/* Cards */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide pb-2"
        >
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
                <div className="flex flex-col min-w-[260px] max-w-[260px] border rounded-xl shadow-md bg-white hover:shadow-xl transition-all duration-300 overflow-hidden">
                  {/* Image */}
                  <div className="relative">
                    <img
                      src={listing.image || "/placeholder.svg"}
                      alt={listing.name}
                      className="w-full h-[180px] object-cover"
                    />

                    {/* Rating */}
                    <div className="absolute top-2 left-2 bg-white text-black px-2 py-1 rounded-full text-xs font-medium shadow">
                      ⭐ {listing.rating}
                    </div>

                    {/* Favorite */}
                    <button
                      onClick={(e) => toggleFavorite(e, listing.id)}
                      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                    >
                      <CiHeart
                        className={`text-xl ${
                          favorites[listing.id] ? "text-red-500 fill-red-500" : "text-black"
                        }`}
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
                  <div className="p-3">
                    <h3 className="font-semibold text-base mb-1">{listing.name}</h3>
                    <p className="text-gray-500 text-xs mb-1">{listing.location}</p>
                    <p className="text-gray-500 text-xs">
                      Upto {listing.guests} Guests • {listing.rooms} Rooms • {listing.baths} Baths
                    </p>

                    {/* Price */}
                    <div className="mt-3 text-sm">
                      <span className="font-semibold text-base">{listing.price}</span>
                      {listing.oldPrice && (
                        <span className="text-gray-400 line-through ml-2">{listing.oldPrice}</span>
                      )}
                      <p className="text-gray-400 text-xs">Per Night + Taxes</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Scroll Right */}
        <button
          onClick={scrollRight}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 p-2 shadow-md rounded-full"
        >
          <FaChevronRight />
        </button>
      </div>
    </section>
  )
}
