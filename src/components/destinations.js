"use client"
import { useState, useEffect } from "react"
import { GrMapLocation } from "react-icons/gr"
import { fetchDestinations } from "../lib/firebase"

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
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-start items-center gap-4 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Pick a Destination</h2>
          <div className="flex text-gray-700 gap-2 items-center cursor-pointer">
            <GrMapLocation className="h-4 w-4" />
            <span className="text-sm underline">Show nearby locations</span>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center p-10">
            <div className="animate-pulse">Loading destinations...</div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {destinations.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-4 rounded-lg hover:bg-orange-200 cursor-pointer transition duration-300"
              >
                <div className="bg-orange-100 rounded-full p-2 mb-2">
                  <img src={item.image || "/placeholder.svg"} className="h-12 w-12" alt={item.place} />
                </div>
                <h3 className="text-gray-700 text-sm font-medium">{item.place}</h3>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
