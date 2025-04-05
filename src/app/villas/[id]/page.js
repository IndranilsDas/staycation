"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { fetchVilla } from "../../../lib/firebase"
import Link from "next/link"
import {
  Star,
  Users,
  ChevronRight,
  ChevronLeft,
  Phone,
  CheckCircle,
  MinusCircle,
  XCircle,
  Triangle,
  RotateCcw,
  Bed,
  Bath,
  UtensilsCrossed,
  AlertCircle,
} from "lucide-react"

// Default amenities data to use when property.amenities is empty
const defaultAmenities = [
  { label: "BBQ", icon: "/placeholder.svg?height=32&width=32", price: "₹3,500", id: 1 },
  { label: "Balcony / Terrace", icon: "/placeholder.svg?height=32&width=32", id: 2 },
  { label: "Bathtub", icon: "/placeholder.svg?height=32&width=32", id: 3 },
  { label: "Music System / Speaker", icon: "/placeholder.svg?height=32&width=32", id: 4 },
  { label: "Pet Friendly", icon: "/placeholder.svg?height=32&width=32", id: 5 },
  { label: "Driver / Staff Accommodation", icon: "/placeholder.svg?height=32&width=32", price: "₹1,000", id: 6 },
  { label: "Lawn", icon: "/placeholder.svg?height=32&width=32", id: 7 },
  { label: "Indoor / Outdoor Games", icon: "/placeholder.svg?height=32&width=32", id: 8 },
  { label: "Wi-Fi", icon: "/placeholder.svg?height=32&width=32", id: 9 },
  { label: "TV", icon: "/placeholder.svg?height=32&width=32", id: 10 },
  { label: "AC", icon: "/placeholder.svg?height=32&width=32", id: 11 },
  { label: "Gazebo", icon: "/placeholder.svg?height=32&width=32", id: 12 },
  { label: "Swimming Pool", icon: "/placeholder.svg?height=32&width=32", id: 13 },
]

export default function VillaDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [scrolled, setScrolled] = useState(false)

  // Refs for navigation elements
  const detailNavRef = useRef(null)
  const [detailNavHeight, setDetailNavHeight] = useState(0)
  const navRef = useRef(null)
  const [navHeight, setNavHeight] = useState(0)

  // Measure the detail nav height once
  useEffect(() => {
    if (detailNavRef.current) {
      setDetailNavHeight(detailNavRef.current.offsetHeight)
    }
  }, [])

  // Measure second nav height once
  useEffect(() => {
    if (navRef.current) {
      setNavHeight(navRef.current.offsetHeight)
    }
  }, [])

  // Fetch villa data
  useEffect(() => {
    const getVillaDetails = async () => {
      setLoading(true)
      try {
        const data = await fetchVilla(id)
        setProperty(data)
      } catch (error) {
        console.error("Error fetching villa details:", error)
        router.push("/")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      getVillaDetails()
    }
  }, [id, router])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > window.innerHeight)
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen p-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="animate-pulse flex flex-col items-center justify-center h-96">
            <p className="text-xl">Loading property details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen p-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-center h-96">
            <p className="text-xl">Property not found</p>
            <Link href="/" className="mt-4 flex items-center text-blue-600 hover:underline">
              <ChevronLeft className="mr-2" /> Back to home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Use property amenities if available, otherwise use default amenities
  const displayAmenities = property.amenities && property.amenities.length > 0 ? property.amenities : defaultAmenities

  return (
    <section className="bg-white font-sans">
      {/* Fixed Detail Nav */}
      <div ref={detailNavRef} className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/">
              <img src="/placeholder.svg?height=40&width=120" alt="StayVista Logo" className="h-10" />
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">Sign In</button>
            <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Book Now</button>
          </div>
        </div>
      </div>

      {/* Spacer so content doesn't go behind the detail nav */}
      <div style={{ height: detailNavHeight }} />

      <div className="container mx-auto px-4 md:px-12 flex flex-col justify-center">
        <div className="flex flex-col justify-center">
          {/* Breadcrumb Navigation */}
          <nav>
            <div className="flex items-center my-6 justify-between">
              <div className="flex items-center gap-2 text-black">
                <Link href="/" className="hover:underline">
                  Home
                </Link>
                <ChevronRight className="h-4 w-4" />
                <button className="hover:underline">Villas in {property.location.split(",")[0]}</button>
                <ChevronRight className="h-4 w-4" />
                <button className="hover:underline">
                  {property.villaName} in {property.location.split(",")[0]}
                </button>
              </div>
              <div className="flex">
                <div className="flex border border-red-600 px-4 py-2 bg-white text-black items-center rounded gap-2 cursor-pointer hover:bg-gray-50">
                  <img src="/placeholder.svg?height=16&width=16" className="h-4 w-4" alt="Brochure" />
                  View Brochure
                </div>
              </div>
            </div>
          </nav>

          {/* Hero Images Section */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
            <img
              src={property.heroImages[0]?.url || "/placeholder.svg?height=560&width=960"}
              className="h-auto w-full md:w-2/3 rounded-xl object-cover"
              alt={`${property.villaName} Main View`}
            />
            <div className="flex flex-col gap-4 w-full md:w-1/3">
              <img
                src={property.heroImages[1]?.url || "/placeholder.svg?height=272&width=400"}
                className="h-auto w-full rounded-xl object-cover"
                alt={`${property.villaName} View 1`}
              />
              <img
                src={property.heroImages[2]?.url || "/placeholder.svg?height=268&width=400"}
                className="h-auto w-full rounded-xl object-cover"
                alt={`${property.villaName} View 2`}
              />
            </div>
          </div>
        </div>

        <div id="info">
          {/* Second Navigation */}
          <nav
            ref={navRef}
            className={`py-6 transition-all duration-300 ${
              scrolled ? "fixed left-0 w-full bg-white shadow-md z-40 flex items-center justify-center" : ""
            }`}
            style={scrolled ? { top: detailNavHeight } : {}}
          >
            <div className="flex justify-center gap-4 md:gap-13 border-b overflow-x-auto w-full px-4">
              <button className="hover:bg-gray-200 hover:scale-105 text-sm md:text-lg text-black px-2 py-2 rounded transition duration-300 whitespace-nowrap">
                Overview
              </button>
              <button className="hover:bg-gray-200 hover:scale-105 text-sm md:text-lg text-black px-2 py-2 rounded transition duration-300 whitespace-nowrap">
                Highlights
              </button>
              <button className="hover:bg-gray-200 hover:scale-105 text-sm md:text-lg text-black px-2 py-2 rounded transition duration-300 whitespace-nowrap">
                Refund Policy
              </button>
              <button className="hover:bg-gray-200 hover:scale-105 text-sm md:text-lg text-black px-2 py-2 rounded transition duration-300 whitespace-nowrap">
                Spaces
              </button>
              <button className="hover:bg-gray-200 hover:scale-105 text-sm md:text-lg text-black px-2 py-2 rounded transition duration-300 whitespace-nowrap">
                Reviews
              </button>
              <button className="hover:bg-gray-200 hover:scale-105 text-sm md:text-lg text-black px-2 py-2 rounded transition duration-300 whitespace-nowrap">
                Amenities
              </button>
              <button className="hover:bg-gray-200 hover:scale-105 text-sm md:text-lg text-black px-2 py-2 rounded transition duration-300 whitespace-nowrap">
                Meals
              </button>
              <button className="hover:bg-gray-200 hover:scale-105 text-sm md:text-lg text-black px-2 py-2 rounded transition duration-300 whitespace-nowrap">
                Location
              </button>
              <button className="hover:bg-gray-200 hover:scale-105 text-sm md:text-lg text-black px-2 py-2 rounded transition duration-300 whitespace-nowrap">
                Experiences
              </button>
              <button className="hover:bg-gray-200 hover:scale-105 text-sm md:text-lg text-black px-2 py-2 rounded transition duration-300 whitespace-nowrap">
                FAQs
              </button>
            </div>
          </nav>

          {/* Spacer to prevent layout shift for second nav when it's fixed */}
          {scrolled && <div style={{ height: navHeight }} />}

          {/* Main Content Section */}
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-2/3 overflow-y-auto">
              <div id="info-details" className="py-6 flex flex-col gap-4">
                <h1 className="text-black text-3xl flex items-center gap-2">
                  {property.villaName}
                  <img src="/placeholder.svg?height=24&width=24" alt="paw" className="h-6 w-6" />
                </h1>
                <h2 className="text-black">{property.location}</h2>
                <h3 className="font-light text-black flex items-center gap-2">
                  {property.guestFavorite && (
                    <>
                      <img src="/placeholder.svg?height=20&width=20" alt="leaf" className="h-5 w-5" />
                      Guest Favourite!
                      <img src="/placeholder.svg?height=20&width=20" alt="leaf" className="h-5 w-5" />
                    </>
                  )}
                  <Star className="text-yellow-400 h-5 w-5" />
                  <div>
                    <b>{property.rating}</b>/5
                  </div>
                </h3>
                <div className="flex flex-wrap gap-2">
                  <div className="rounded p-2 bg-blue-100 text-black text-sm md:text-lg flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Up to {property.maxGuests} Guests
                  </div>
                  <div className="rounded p-2 bg-blue-100 text-black text-sm md:text-lg flex items-center gap-2">
                    <Bed className="h-5 w-5" />
                    {property.rooms} Rooms
                    <AlertCircle className="h-4 w-4" />
                  </div>
                  <div className="rounded p-2 bg-blue-100 text-black text-sm md:text-lg flex items-center gap-2">
                    <Bath className="h-5 w-5" />
                    {property.baths} Baths
                  </div>
                  {property.mealsAvailable && (
                    <div className="rounded p-2 bg-blue-100 text-black text-sm md:text-lg flex items-center gap-2">
                      <UtensilsCrossed className="h-5 w-5" />
                      Meals Available
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-4 py-4">
                  {displayAmenities.slice(0, 5).map((amenity) => (
                    <div
                      key={amenity.id}
                      className="h-14 w-14 border border-gray-400 rounded flex items-center justify-center"
                    >
                      <img src={amenity.icon || "/placeholder.svg"} className="h-8 w-8" alt={amenity.label} />
                    </div>
                  ))}
                </div>
                <button className="w-full md:w-auto bg-gradient-to-tr from-orange-100 to-blue-100 flex items-center justify-between py-3.5 px-4 rounded-md">
                  <div className="flex items-center text-black text-lg gap-2">
                    <Phone className="h-6 w-6 text-black" />
                    Connect with Host
                  </div>
                  <div className="hover:bg-black hover:text-white transition duration-300 px-4 py-2.5 text-lg rounded-full text-black border border-black">
                    Request Callback
                  </div>
                </button>

                <section className="flex flex-col overflow-x-auto">
                  <div className="flex flex-col">
                    <h1 className="text-3xl px-4 text-black border-l-4 border-red-800">The StayVista Experience</h1>
                    <h3 className="text-lg text-black py-8 w-full overflow-x-auto">
                      <i className="whitespace-normal">{property.description}</i>
                    </h3>
                    <div className="flex py-6 gap-2">
                      <button className="hover:bg-zinc-300 px-4 py-2 bg-blue-100 border text-black rounded border-gray-300">
                        Explore Your Stays
                      </button>
                      <button className="hover:bg-zinc-300 px-4 py-2 bg-blue-100 border text-black rounded border-gray-300">
                        FAQs
                      </button>
                    </div>
                  </div>
                  <div id="divider" className="border-b border-gray-300 h-2 w-full my-6"></div>

                  <div className="flex flex-col">
                    <h1 className="text-3xl px-4 text-black border-l-4 border-red-800">Rules and Refund Policy</h1>
                  </div>
                  <div className="flex items-center w-full py-4">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                    <div className="border-b-2 border-dashed border-gray-600 w-full"></div>
                    <MinusCircle className="h-10 w-10 text-yellow-400" />
                    <div className="border-b-2 border-dashed border-gray-600 w-full"></div>
                    <XCircle className="h-10 w-10 text-red-400" />
                  </div>
                  <div className="flex justify-between w-full">
                    <div className="font-semibold text-black">
                      100% Future Stay Voucher /<br /> 80% Refund
                      <br />
                      <h1 className="font-medium">Before 14 days</h1>
                    </div>
                    <div className="font-semibold text-black">
                      50% Future Stay Voucher /<br /> Refund
                      <br />
                      <h1 className="font-medium">7 to 14 days</h1>
                    </div>
                    <div className="font-semibold text-black">
                      No Refund
                      <br />
                      <h1 className="font-medium">Less than 7 days</h1>
                    </div>
                  </div>
                  <div className="flex py-6 gap-2">
                    <button className="hover:bg-zinc-300 px-4 py-2 bg-blue-100 border text-black rounded border-gray-300">
                      Refund Policy
                    </button>
                    <button className="hover:bg-zinc-300 px-4 py-2 bg-blue-100 border text-black rounded border-gray-300">
                      Home Rules and Policy
                    </button>
                  </div>
                  <div>
                    <h1 className="text-black">
                      Check-in time: <b className="font-semibold">{property.checkInTime}</b> , Check-out time:{" "}
                      <b className="font-semibold">{property.checkOutTime}</b>
                      <br />
                      <div className="text-gray-500 font-light">
                        <u>Note:</u> Early check-in and late check-out is subject to availability (at an additional fee)
                      </div>
                    </h1>
                  </div>
                  <div id="divider" className="border-b border-gray-300 h-2 w-full my-6"></div>

                  {/* Spaces Section */}
                  {property.spaces && property.spaces.length > 0 && (
                    <div className="my-6">
                      <div className="flex items-center justify-between mb-4">
                        <h1 className="text-3xl px-4 my-4 text-black border-l-4 border-red-800">Spaces</h1>
                      </div>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 w-full">
                        {property.spaces.map((space) => (
                          <div key={space.id} className="border rounded-md overflow-hidden shadow-sm">
                            <img
                              src={space.imageUrl || "/placeholder.svg?height=200&width=300"}
                              alt={space.title}
                              className="w-full h-48 object-cover"
                            />
                            <div className="p-4">
                              <h3 className="text-lg font-semibold mb-2">{space.title}</h3>
                              <ul className="list-none space-y-1 text-gray-700 text-sm">
                                {space.details.map((detail, i) => (
                                  <li key={i}>{detail}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div id="divider" className="border-b border-gray-300 h-2 w-full my-6"></div>
                    </div>
                  )}

                  {/* Reviews Section */}
                  {property.reviews && property.reviews.length > 0 && (
                    <div className="flex flex-col gap-4 my-6">
                      <h1 className="text-3xl px-4 text-black border-l-4 border-red-800">Guest Reviews</h1>
                      <button className="px-2 py-1 flex justify-center w-30 items-center text-black hover:bg-black hover:text-white border border-black rounded">
                        <img src="/placeholder.svg?height=32&width=32" className="h-8 w-8" alt="StayVista Logo" />
                        <h1 className="ml-2">StayVista</h1>
                      </button>
                      <div className="font-light text-black flex items-center gap-4">
                        <Star className="text-yellow-400 h-5 w-5" />
                        <div>
                          <b>{property.rating}</b>/5
                        </div>
                        <div className="border-[0.05px] border-l-gray-500 h-4"></div>
                        {property.guestFavorite && (
                          <>
                            <img src="/placeholder.svg?height=20&width=20" alt="leaf" className="h-5 w-5" />
                            Guest Favourite!
                            <img src="/placeholder.svg?height=20&width=20" alt="leaf" className="h-5 w-5" />
                          </>
                        )}
                      </div>
                      <nav>
                        <div className="flex flex-wrap gap-2.5">
                          <button className="hover:bg-green-100 px-4 py-1 text-lg font-light text-black rounded border border-black">
                            All
                          </button>
                          <button className="hover:bg-green-100 px-4 py-1 text-lg font-light text-black rounded border border-black">
                            Amenities
                          </button>
                          <button className="hover:bg-green-100 px-4 py-1 text-lg font-light text-black rounded border border-black">
                            Stay
                          </button>
                          <button className="hover:bg-green-100 px-4 py-1 text-lg font-light text-black rounded border border-black">
                            Food
                          </button>
                          <button className="hover:bg-green-100 px-4 py-1 text-lg font-light text-black rounded border border-black">
                            Service
                          </button>
                          <button className="hover:bg-green-100 px-4 py-1 text-lg font-light text-black rounded border border-black">
                            View
                          </button>
                        </div>
                      </nav>
                      <div className="mt-4 flex flex-col gap-4 w-full">
                        {property.reviews.map((review) => (
                          <div key={review.id} className="p-4 border border-gray-200 rounded shadow-sm">
                            <h4 className="text-lg font-semibold mb-1">{review.name}</h4>
                            <p className="text-gray-700">{review.review}</p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4">
                        <a href="#" className="text-blue-500 underline">
                          See all reviews
                        </a>
                      </div>
                      <div id="divider" className="border-b border-gray-300 h-2 w-full my-6"></div>
                    </div>
                  )}

                  {/* Amenities Section */}
                  {displayAmenities.length > 0 && (
                    <div className="flex flex-col overflow-x-auto">
                      <h1 className="text-3xl px-4 my-4 text-black border-l-4 border-red-800">Villa Amenities</h1>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8 py-4 w-full">
                        {displayAmenities.slice(0, 9).map((amenity) => (
                          <div key={amenity.id} className="flex items-center space-x-2">
                            <img
                              src={amenity.icon || "/placeholder.svg?height=32&width=32"}
                              alt={`${amenity.label} Icon`}
                              className="w-12 h-12 p-2 border border-gray-400 rounded"
                            />
                            <span className="text-sm text-black whitespace-nowrap">
                              {amenity.label}
                              {amenity.price && <span className="text-gray-600"> {amenity.price}</span>}
                            </span>
                          </div>
                        ))}
                        {displayAmenities.length > 9 && (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-blue-500 cursor-pointer whitespace-nowrap">
                              +{displayAmenities.length - 9} more
                            </span>
                          </div>
                        )}
                      </div>
                      <div id="divider" className="border-b border-gray-300 h-2 w-full my-6"></div>
                    </div>
                  )}

                  {/* Meals Section */}
                  {property.mealsAvailable && property.mealsInfo && (
                    <div>
                      <h1 className="text-3xl px-4 my-4 text-black border-l-4 border-red-800">Meals</h1>
                      <div className="p-4 w-full">
                        <div className="flex flex-wrap space-x-2 mb-4">
                          <button className="bg-gray-200 hover:bg-gray-300 px-4 py-2 text-black rounded-full flex items-center gap-2">
                            <div className="bg-green-500 h-3 w-3 rounded-full"></div>
                            <Triangle className="text-red-500 h-4 w-4" />
                            Mix Menu
                          </button>
                          <button className="bg-gray-200 hover:bg-gray-300 px-4 py-2 text-black rounded-full">
                            View More
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black">
                          <div>
                            <p className="mb-4">{property.mealsInfo.description1}</p>
                          </div>
                          <div>
                            <p className="mb-4">{property.mealsInfo.description2}</p>
                          </div>
                        </div>
                      </div>
                      <div id="divider" className="border-b border-gray-300 h-2 w-full my-6"></div>
                    </div>
                  )}

                  {/* Experiences Section */}
                  {property.experiences && (
                    <div className="flex flex-col">
                      <h1 className="text-3xl px-4 my-4 text-black border-l-4 border-red-800">Experiences</h1>
                      <div className="text-black w-full text-left">{property.experiences}</div>
                      <div id="divider" className="border-b border-gray-300 h-2 w-full my-6"></div>
                    </div>
                  )}

                  {/* FAQs Section */}
                  {property.faqs && property.faqs.length > 0 && (
                    <div>
                      <h1 className="text-3xl px-4 my-4 text-black border-l-4 border-red-800">
                        FAQ's related to {property.villaName} - {property.location.split(",")[0]}
                      </h1>
                      <div className="mt-4 space-y-4">
                        {property.faqs.map((faq) => (
                          <div key={faq.id} className="border-b pb-4">
                            <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                            <p className="text-gray-700">{faq.answer}</p>
                          </div>
                        ))}
                      </div>
                      <div id="divider" className="border-b border-gray-300 h-2 w-full my-6"></div>
                    </div>
                  )}
                </section>
              </div>
            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-1/3 flex flex-col sticky top-24 h-fit">
              <div className="flex flex-col bg-gradient-to-br from-orange-100 to-blue-100 p-4 rounded-t-lg">
                <div className="flex flex-col">
                  <span className="text-gray-400 text-lg flex items-center line-through">
                    ₹{Number(property.originalPrice).toLocaleString("en-IN")}
                  </span>
                  <div className="flex items-center gap-2">
                    <h1 className="text-black flex text-3xl items-center">
                      ₹{Number(property.discountedPrice).toLocaleString("en-IN")}
                    </h1>
                    <h1 className="text-gray-400">(for {property.rooms} rooms) Per Night + Taxes</h1>
                  </div>
                  <div className="flex justify-center gap-4 pt-6">
                    <div className="h-20 w-full rounded bg-white border border-gray-300 flex items-center justify-center text-gray-400">
                      Check-in
                    </div>
                    <div className="h-20 w-full rounded bg-white border border-gray-300 flex items-center justify-center text-gray-400">
                      Check-out
                    </div>
                  </div>
                  <div className="flex justify-center pt-6 gap-4">
                    <div className="h-12 w-full rounded bg-white border border-gray-300 flex items-center justify-center text-gray-400">
                      Adults
                    </div>
                    <div className="h-12 w-full rounded bg-white border border-gray-300 flex items-center justify-center text-gray-400">
                      Children
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full py-2 my-2 bg-green-100 text-green-700 text-center rounded-lg">
                Select Dates for Best Price
              </div>
              <div className="w-full py-4 my-2 bg-black text-white text-center rounded-lg cursor-pointer hover:bg-gray-800">
                Select Dates
              </div>
              <div className="flex items-center justify-start gap-2 my-2 text-sm text-gray-600">
                <RotateCcw className="text-gray-600 h-4 w-4" />
                <h1>For Cancellation and Refund Policy,</h1>
                <h1>
                  <u className="text-blue-700 cursor-pointer">click here</u>
                </h1>
              </div>
              <button className="w-full p-4 bg-gradient-to-tr from-orange-100 to-blue-100 my-4 flex items-center justify-between py-3.5 px-4 rounded-lg">
                <div className="flex items-center text-black text-lg gap-2">
                  <Phone className="h-6 w-6 text-black" />
                  Connect with Host
                </div>
                <div className="hover:bg-black hover:text-white transition duration-300 px-4 py-2.5 text-lg rounded-full text-black border border-black">
                  Request Callback
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}