"use client"
import { useState, useEffect } from "react"
import { Prompt } from "next/font/google"
import { HiOutlineHome, HiOutlineBadgeCheck, HiOutlineShieldCheck } from "react-icons/hi"
import { fetchFeatures } from "../lib/firebase"

// Google Font
const prompt = Prompt({
  subsets: ["latin"],
  weight: ["200", "300", "400", "600", "800"],
})

// Icon mapping
const iconMap = {
  home: <HiOutlineHome className="w-16 h-16 md:w-16 md:h-16" />,
  badge: <HiOutlineBadgeCheck className="w-16 h-16 md:w-16 md:h-16" />,
  shield: <HiOutlineShieldCheck className="w-16 h-16 md:w-16 md:h-16" />,
}

export default function Features() {
  const [features, setFeatures] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getFeatures = async () => {
      setLoading(true)
      try {
        const data = await fetchFeatures()
        setFeatures(data)
      } catch (error) {
        console.error("Error fetching features:", error)
        // Fallback data
        setFeatures([
          {
            iconType: "home",
            title: "Exclusive Experiences",
            description: "Handpicked villas for unforgettable stays",
          },
          {
            iconType: "badge",
            title: "Unmatched Service",
            description: "Dedicated concierge & travel assistance",
          },
          {
            iconType: "shield",
            title: "Superior Guest Value",
            description: "Prioritising safety, cleanliness & service",
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    getFeatures()
  }, [])

  if (loading) {
    return (
      <section className={`${prompt.className} w-full bg-white text-black py-12 flex justify-center items-center`}>
        <div className="animate-pulse">Loading features...</div>
      </section>
    )
  }

  return (
    <section className={`${prompt.className} w-full bg-white text-black py-12`}>
      <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-12">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-semibold text-center mb-8">India's Trusted Luxury Villa Rentals</h2>

        {/* Feature Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 text-center md:text-left">
          {features.map((item, idx) => (
            <div
              key={idx}
              className={`flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 p-6 border-gray-300 
                ${idx < features.length - 1 ? "md:border-r" : ""}`}
            >
              {/* Icon */}
              <div className="text-gray-800">{iconMap[item.iconType] || iconMap["home"]}</div>

              {/* Text */}
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-1">{item.title}</h3>
                <p className="text-sm md:text-md text-gray-500">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

