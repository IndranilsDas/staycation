"use client"
import { useState, useEffect } from "react"
import { fetchOffers } from "../lib/firebase"
import { Copy } from "lucide-react"

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
            title: "Get 11% off (up to ₹3000) on your StayVista booking when you pay with an HSBC TravelOne Credit Card.",
            type: "bank_offer",
            code: "HSBCTRAVEL",
          },
          {
            title: "Enjoy FLAT 50% OFF on 2nd night when you book our newly launched vistas.",
            type: "stayvista_offer",
            code: "NEWVISTAS",
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
    <section className="font-[Prompt] bg-white py-12">
      <div className="px-4 md:px-20">
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

        {/* Offers */}
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
                <div className="flex items-center justify-between mb-2">
                  <img
                    src="/hsbc-logo.png" // Use dynamic image based on offer later if needed
                    alt={offer.title}
                    className="h-6"
                  />
                  <span className="rounded text-xs px-2 py-1 bg-gray-100 text-gray-600 border border-gray-300">
                    {offer.type === "bank_offer" ? "Bank Offer" : "StayVista Offer"}
                  </span>
                </div>

                {/* Title (Main Offer Text) */}
                <p className="text-sm text-gray-800 font-medium mt-2 mb-1">
                  {offer.title}
                </p>

                <p className="text-xs text-gray-400 mb-3">*T&C apply</p>

                <div className="flex items-center justify-between mt-auto">
                  <div className="bg-gray-200 text-gray-800 font-mono px-2 py-1 rounded text-sm">
                    {offer.code}
                  </div>
                  <button
                    onClick={() => copyCode(offer.code)}
                    className="bg-black text-white text-sm px-3 py-1 rounded hover:bg-gray-800 flex items-center"
                  >
                    <Copy className="h-3 w-3 mr-1" />
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
