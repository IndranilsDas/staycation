"use client"
import { useState, useEffect } from "react"
import { GrMapLocation } from "react-icons/gr"
import { fetchDestinations } from "../lib/firebase"
import { Prompt } from 'next/font/google'

const prompt = Prompt({
  subsets: ["latin"],
  weight: ["200", "300", "400", "600", "800"],
})

export default function Destinations() {
  const [destinations, setDestinations] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadDestinations() {
      setLoading(true)
      try {
        const data = await fetchDestinations()
        setDestinations(data)
      } catch (error) {
        console.error("Error fetching destinations:", error)
      }
      setLoading(false)
    }
    loadDestinations()
  }, [])

  return (
    <section className={`${prompt.className} bg-white py-12 pt-24`}>
      <div className="px-4 md:px-20">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-black">Pick a Destination</h2>
          <div className="flex items-center text-sm text-blue-600 hover:underline cursor-pointer gap-1">
            <GrMapLocation className="w-4 h-4" />
            <span>Show nearby locations</span>
          </div>
        </div>

        {/* Loading or Grid */}
        {loading ? (
          <div className="flex justify-center items-center p-10">
            <div className="animate-pulse">Loading destinations...</div>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {destinations.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-xl shadow hover:bg-orange-100 transition-all duration-300 cursor-pointer"
              >
                <div className="bg-orange-200 rounded-full p-3 mb-2">
                  <img
                    src={item.image || "/placeholder.svg"}
                    className="h-10 w-10 object-contain"
                    alt={item.place}
                  />
                </div>
                <span className="text-sm text-gray-800 font-medium">{item.place}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
