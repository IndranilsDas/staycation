"use client"

import { useRef, useState, useEffect } from "react"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"
import { Prompt } from 'next/font/google'
import { fetchTrending } from "../lib/firebase"
import Link from "next/link"

const prompt = Prompt({
  subsets: ["latin"],
  weight: ["200", "300", "400", "600", "800"],
})

const tabs = ["All", "Lonavala", "Alibaug", "Coorg", "Explore more"]

export default function TrendingSection() {
  const scrollRef = useRef(null)
  const [selectedTab, setSelectedTab] = useState("All")
  const [destinations, setDestinations] = useState([])
  const [loading, setLoading] = useState(true)
  const [isDiscounted , SetisDiscounted] = useState(false)

  useEffect(() => {
    const getTrending = async () => {
      setLoading(true)
      try {
        const data = await fetchTrending(selectedTab)
        setDestinations(data)
      } catch (error) {
        console.error("Error fetching trending destinations:", error)
        // Fallback data
        setDestinations([
          {
            id: "fallback1",
            title: "Twilight Perch",
            location: "Mussoorie, Uttarakhand",
            guests: 10,
            rooms: 4,
            baths: 4,
            price: "₹31,231",
            originalPrice: "₹34,590",
            rating: 4.5,
            image: "/images/places/mussoorie.jpg",
            bookingCount: 12,
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    getTrending()
  }, [selectedTab])

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" })
  }

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" })
  }

  return (
    <section className={`${prompt.className} p-6 bg-white`}>
      {/* Heading */}
      <div className="flex justify-between items-center px-16 mb-4">
        <h1 className="text-left font-semibold text-3xl text-black">Trending This Season</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 px-16 mb-4 py-4 items-left overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-4 py-2 rounded-md transition ${
              selectedTab === tab
                ? "bg-black/50 text-white"
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
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 p-2 shadow-md rounded-full cursor-pointer"
        >
          <FaChevronLeft />
        </button>

        {/* Cards */}
        <div
          ref={scrollRef}
          className="flex m-auto gap-4 overflow-clip py-2 transition duration-300 scroll-smooth no-scrollbar mx-16"
        >
          {loading ? (
            <div className="flex justify-center items-center w-full p-10">
              <div className="animate-pulse">Loading trending properties...</div>
            </div>
          ) : destinations.length === 0 ? (
            <div className="flex justify-center items-center w-full p-10">
              <p>No trending properties found for this location.</p>
            </div>
          ) : (
            destinations.map((item) => (
              <Link
                key={item.id}
                href={`/villas/${item.id}`}
                className="cursor-pointer"
              >
                <div className="flex flex-col p-4 min-w-[280px] max-w-[280px] ring ring-gray-300 rounded-lg shadow-lg bg-white hover:shadow-2xl transition-all duration-300">
                  {/* Image */}
                  <div className="relative">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-40 object-cover rounded-md mb-2"
                    />

                    {/* Booking Count Badge */}
                    {item.bookingCount > 0 && (
                      <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                        {item.bookingCount} Bookings
                      </div>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center mb-1">
                    <span className="bg-yellow-100 text-yellow-600 text-xs px-2 py-1 rounded-md">{item.rating} ⭐</span>
                  </div>

                  {/* Title */}
                  <h2 className="text-lg font-semibold">{item.title}</h2>
                  
                  <div className="flex flex-col h-15">
                  {/* Location */}
                  <p className="text-sm text-gray-500">{item.location}</p>

                  {/* Info */}
                  <p className="text-sm text-gray-500">
                    Upto {item.guests} Guests + {item.rooms} Rooms + {item.baths} Baths
                  </p>
                  </div>

                  {/* Price */}

                  {item.price ? (
                    <div className="flex items-center justify-between mt-2">
                    {item.price ? (
                      <>
                        <span className="text-black font-semibold">
                          {item.price}
                        </span>
                        <span className="line-through text-gray-400 text-sm ml-2">
                          {item.originalPrice}
                        </span>
                      </>
                    ) : (
                      <span className="text-black font-semibold">
                        {item.originalPrice}
                      </span>
                    )}
                  </div>

                  ):(
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-black font-semibold">
                        {item.originalPrice}
                      </span>
                    </div>
                  )}
                  


                  {/* Badges */}
                  <div className="flex gap-2 mt-2">
                    {item.rating >= 4.8 && (
                      <div className="bg-black text-white text-xs px-2 py-1 rounded-md w-max">Best Rated</div>
                    )}
                    {item.bookingCount >= 10 && (
                      <div className="bg-orange-500 text-white text-xs px-2 py-1 rounded-md w-max">Hot Property</div>
                    )}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Right Button */}
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 p-2 shadow-md rounded-full cursor-pointer"
        >
          <FaChevronRight />
        </button>
      </div>
    </section>
  )
}
