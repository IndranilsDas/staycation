"use client"
import { useState, useEffect } from "react"
import { Prompt } from "next/font/google"
import { fetchOffers } from "../lib/firebase"

const prompt = Prompt({
  subsets: ["latin"],
  weight: ["200", "300", "400", "600", "800"],
})

const tabs = [{ text: "All" }, { text: "Bank offers" }, { text: "StayVista offers" }]

export default function Offers() {
  const [activeTab, setActiveTab] = useState("All")
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getOffers = async () => {
      setLoading(true)
      try {
        const data = await fetchOffers(activeTab)
        setOffers(data)
      } catch (error) {
        console.error("Error fetching offers:", error)
        setOffers([
          {
            description:
              "Get 11% off (up to ₹3000) on your StayVista booking when you pay with an HSBC TravelOne Credit Card.",
            type: "bank_offer",
            code: "HSBCTRAVELONE",
            title: "HSBC",
          },
          {
            description:
              "Enjoy FLAT 50% OFF on 2nd night when you book our newly launched vistas for your next holiday adventure.",
            type: "stayvista_offer",
            code: "NEWVISTAS",
            title: "StayVista",
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    getOffers()
  }, [activeTab])

  const copyCode = (code) => {
    navigator.clipboard.writeText(code)
    alert(`Copied: ${code}`)
  }

  return (
    <section className={`${prompt.className} bg-white py-12`}>
      <div className="px-4 md:px-20">
        {/* Heading */}
        <h2 className="text-3xl font-semibold text-black mb-4">Offers for You</h2>

        {/* Tabs */}
        <div className="flex gap-3 overflow-x-auto mb-6 scrollbar-hide">
          {tabs.map((item, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(item.text)}
              className={`px-4 py-2 rounded-full whitespace-nowrap border transition 
                ${
                  activeTab === item.text
                    ? "bg-blue-100 text-blue-800 border-blue-200"
                    : "bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200"
                }`}
            >
              {item.text}
            </button>
          ))}
        </div>

        {/* Offers Row */}
        {loading ? (
          <div className="flex justify-center items-center p-10">
            <div className="animate-pulse">Loading offers...</div>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto scrollbar-hide">
            {offers.map((offer, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[260px] bg-white border border-gray-200 rounded-2xl p-4 shadow-sm"
              >
                {/* Title & Type */}
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{offer.title || "Bank"}</h3>
                  <span className="text-xs text-gray-500 capitalize">
                    {offer.type === "bank_offer" ? "Bank Offer" : "StayVista Offer"}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-700 mb-3">{offer.description}</p>
                <p className="text-xs text-gray-400">*T&C apply</p>

                {/* Code & Copy */}
                <div className="flex items-center justify-between mt-4">
                  <div className="bg-gray-200 text-gray-800 font-mono px-2 py-1 rounded text-sm">
                    {offer.code}
                  </div>
                  <button
                    onClick={() => copyCode(offer.code)}
                    className="bg-black text-white text-sm px-3 py-1 rounded hover:bg-gray-800"
                  >
                    Copy
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
