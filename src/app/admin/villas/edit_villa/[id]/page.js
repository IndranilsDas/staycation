"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PlusCircle, Trash2, ArrowLeft } from "lucide-react"
import { saveVilla, uploadImage, fetchCollections, fetchVillaById } from "../../../../../lib/firebase"
import AdminDrawer from "../../../../../components/admin/drawer"
import { useAuth } from "../../../../../lib/authcontext"

export default function EditVillaForm({ params }) {
  const router = useRouter()
  const { user, role, loading } = useAuth()
  const [collections, setCollections] = useState([])
  const [isDrawerOpen, setIsDrawerOpen] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState("")

  const [activeTab, setActiveTab] = useState("basic")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Basic villa information
  const [villaName, setVillaName] = useState("")
  const [location, setLocation] = useState("")
  const [collection, setCollection] = useState("")
  const [rating, setRating] = useState("4.9")
  const [guestFavorite, setGuestFavorite] = useState(true)
  const [maxGuests, setMaxGuests] = useState("20")
  const [rooms, setRooms] = useState("6")
  const [baths, setBaths] = useState("6")
  const [mealsAvailable, setMealsAvailable] = useState(true)

  // Check-in/out times
  const [checkInTime, setCheckInTime] = useState("2PM")
  const [checkOutTime, setCheckOutTime] = useState("11AM")

  // Pricing
  const [originalPrice, setOriginalPrice] = useState("")
  const [discountedPrice, setDiscountedPrice] = useState("")

  // Description
  const [description, setDescription] = useState("")

  // Images
  const [heroImages, setHeroImages] = useState([
    { id: 1, name: "Main Hero Image", file: null, preview: "/placeholder.svg?height=400&width=600", url: "" },
    { id: 2, name: "Secondary Image 1", file: null, preview: "/placeholder.svg?height=200&width=300", url: "" },
    { id: 3, name: "Secondary Image 2", file: null, preview: "/placeholder.svg?height=200&width=300", url: "" },
  ])

  // Amenities
  const [amenities, setAmenities] = useState([
    { id: 1, label: "Swimming Pool", icon: "/placeholder.svg?height=40&width=40", selected: true, price: "" },
    { id: 2, label: "Wi-Fi", icon: "/placeholder.svg?height=40&width=40", selected: true, price: "" },
    { id: 3, label: "Bathtub", icon: "/placeholder.svg?height=40&width=40", selected: true, price: "" },
    { id: 4, label: "BBQ", icon: "/placeholder.svg?height=40&width=40", selected: true, price: "" },
    { id: 5, label: "Alfresco Dining", icon: "/placeholder.svg?height=40&width=40", selected: true, price: "" },
    { id: 6, label: "Balcony / Terrace", icon: "/placeholder.svg?height=40&width=40", selected: true, price: "" },
    { id: 7, label: "Music System / Speaker", icon: "/placeholder.svg?height=40&width=40", selected: true, price: "" },
    { id: 8, label: "Pet Friendly", icon: "/placeholder.svg?height=40&width=40", selected: true, price: "" },
    {
      id: 9,
      label: "Driver / Staff Accommodation",
      icon: "/placeholder.svg?height=40&width=40",
      selected: true,
      price: "",
    },
    { id: 10, label: "Lawn", icon: "/placeholder.svg?height=40&width=40", selected: true, price: "" },
    { id: 11, label: "Indoor / Outdoor Games", icon: "/placeholder.svg?height=40&width=40", selected: true, price: "" },
    { id: 12, label: "TV", icon: "/placeholder.svg?height=40&width=40", selected: true, price: "" },
    { id: 13, label: "AC", icon: "/placeholder.svg?height=40&width=40", selected: true, price: "" },
    { id: 14, label: "Gazebo", icon: "/placeholder.svg?height=40&width=40", selected: true, price: "" },
  ])

  // Spaces (Bedrooms)
  const [spaces, setSpaces] = useState([])

  // Reviews
  const [reviews, setReviews] = useState([])

  // Meals information
  const [mealsInfo, setMealsInfo] = useState({
    description1: "",
    description2: "",
  })

  // Experiences
  const [experiences, setExperiences] = useState("")

  // FAQs
  const [faqs, setFaqs] = useState([])

  // Fetch villa data and collections on component mount
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true)
        setLoadError("")

        // Fetch collections
        const fetchedCollections = await fetchCollections()
        setCollections(fetchedCollections)

        // Fetch villa data
        const villaData = await fetchVillaById(params.id)
        if (!villaData) {
          setLoadError("Villa not found")
          return
        }

        // Populate form with villa data
        populateFormWithVillaData(villaData)
      } catch (error) {
        console.error("Error loading data:", error)
        setLoadError("Failed to load villa data. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [params.id])

  // Populate form with villa data
  const populateFormWithVillaData = (villaData) => {
    // Basic info
    setVillaName(villaData.villaName || "")
    setLocation(villaData.location || "")
    setCollection(villaData.collection || "")
    setRating(villaData.rating || "4.9")
    setGuestFavorite(villaData.guestFavorite !== undefined ? villaData.guestFavorite : true)
    setMaxGuests(villaData.maxGuests || "")
    setRooms(villaData.rooms || "")
    setBaths(villaData.baths || "")
    setMealsAvailable(villaData.mealsAvailable !== undefined ? villaData.mealsAvailable : true)

    // Check-in/out times
    setCheckInTime(villaData.checkInTime || "2PM")
    setCheckOutTime(villaData.checkOutTime || "11AM")

    // Pricing
    setOriginalPrice(villaData.originalPrice || "")
    setDiscountedPrice(villaData.discountedPrice || "")

    // Description
    setDescription(villaData.description || "")

    // Hero Images
    if (villaData.heroImages && villaData.heroImages.length > 0) {
      const updatedHeroImages = villaData.heroImages.map((img, index) => ({
        id: img.id || index + 1,
        name: img.name || `Image ${index + 1}`,
        file: null,
        preview: img.url || "/placeholder.svg?height=400&width=600",
        url: img.url || "",
      }))

      // Ensure we have at least 3 hero images
      while (updatedHeroImages.length < 3) {
        updatedHeroImages.push({
          id: updatedHeroImages.length + 1,
          name: `Image ${updatedHeroImages.length + 1}`,
          file: null,
          preview: "/placeholder.svg?height=400&width=600",
          url: "",
        })
      }

      setHeroImages(updatedHeroImages)
    }

    // Amenities
    if (villaData.amenities && villaData.amenities.length > 0) {
      // Create a map of existing amenities for easy lookup
      const amenityMap = {}
      villaData.amenities.forEach((amenity) => {
        amenityMap[amenity.id] = amenity
      })

      // Update existing amenities with data from villa
      const updatedAmenities = amenities.map((amenity) => {
        if (amenityMap[amenity.id]) {
          return {
            ...amenity,
            selected: true,
            price: amenityMap[amenity.id].price || "",
          }
        } else {
          return {
            ...amenity,
            selected: false,
          }
        }
      })

      setAmenities(updatedAmenities)
    }

    // Spaces (Bedrooms)
    if (villaData.spaces && villaData.spaces.length > 0) {
      const updatedSpaces = villaData.spaces.map((space) => ({
        id: space.id,
        title: space.title || "",
        image: null,
        imagePreview: space.imageUrl || "/placeholder.svg?height=200&width=300",
        imageUrl: space.imageUrl || "",
        details: space.details || [],
      }))

      setSpaces(updatedSpaces)
    }

    // Reviews
    if (villaData.reviews && villaData.reviews.length > 0) {
      setReviews(villaData.reviews)
    }

    // Meals info
    if (villaData.mealsInfo) {
      setMealsInfo({
        description1: villaData.mealsInfo.description1 || "",
        description2: villaData.mealsInfo.description2 || "",
      })
    }

    // Experiences
    setExperiences(villaData.experiences || "")

    // FAQs
    if (villaData.faqs && villaData.faqs.length > 0) {
      setFaqs(villaData.faqs)
    }
  }

  // Handle image upload
  const handleImageUpload = (e, index, type) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()

      reader.onload = (event) => {
        if (type === "hero") {
          const updatedImages = [...heroImages]
          updatedImages[index] = {
            ...updatedImages[index],
            file: file,
            preview: event.target.result,
          }
          setHeroImages(updatedImages)
        } else if (type === "space") {
          const updatedSpaces = [...spaces]
          updatedSpaces[index] = {
            ...updatedSpaces[index],
            image: file,
            imagePreview: event.target.result,
          }
          setSpaces(updatedSpaces)
        }
      }

      reader.readAsDataURL(file)
    }
  }

  // Add new space (bedroom)
  const addSpace = () => {
    const newId = spaces.length > 0 ? Math.max(...spaces.map((space) => space.id)) + 1 : 1
    setSpaces([
      ...spaces,
      {
        id: newId,
        title: `Bedroom ${newId}`,
        image: null,
        imagePreview: "/placeholder.svg?height=200&width=300",
        details: ["This bedroom is on the ground floor.", "Includes a king-size bed, AC, Wi-Fi.", "Ensuite Bathroom."],
      },
    ])
  }

  // Remove a space
  const removeSpace = (id) => {
    setSpaces(spaces.filter((space) => space.id !== id))
  }

  // Add a detail to a space
  const addSpaceDetail = (spaceId) => {
    const updatedSpaces = spaces.map((space) => {
      if (space.id === spaceId) {
        return {
          ...space,
          details: [...space.details, ""],
        }
      }
      return space
    })
    setSpaces(updatedSpaces)
  }

  // Update a space detail
  const updateSpaceDetail = (spaceId, detailIndex, value) => {
    const updatedSpaces = spaces.map((space) => {
      if (space.id === spaceId) {
        const updatedDetails = [...space.details]
        updatedDetails[detailIndex] = value
        return {
          ...space,
          details: updatedDetails,
        }
      }
      return space
    })
    setSpaces(updatedSpaces)
  }

  // Remove a space detail
  const removeSpaceDetail = (spaceId, detailIndex) => {
    const updatedSpaces = spaces.map((space) => {
      if (space.id === spaceId) {
        const updatedDetails = space.details.filter((_, index) => index !== detailIndex)
        return {
          ...space,
          details: updatedDetails,
        }
      }
      return space
    })
    setSpaces(updatedSpaces)
  }

  // Add new review
  const addReview = () => {
    const newId = reviews.length > 0 ? Math.max(...reviews.map((review) => review.id)) + 1 : 1
    setReviews([
      ...reviews,
      {
        id: newId,
        name: "",
        review: "",
      },
    ])
  }

  // Remove a review
  const removeReview = (id) => {
    setReviews(reviews.filter((review) => review.id !== id))
  }

  // Add new FAQ
  const addFaq = () => {
    const newId = faqs.length > 0 ? Math.max(...faqs.map((faq) => faq.id)) + 1 : 1
    setFaqs([
      ...faqs,
      {
        id: newId,
        question: "",
        answer: "",
      },
    ])
  }

  // Remove an FAQ
  const removeFaq = (id) => {
    setFaqs(faqs.filter((faq) => faq.id !== id))
  }

  // Toggle amenity selection
  const toggleAmenity = (id) => {
    setAmenities(
      amenities.map((amenity) => (amenity.id === id ? { ...amenity, selected: !amenity.selected } : amenity)),
    )
  }

  // Update amenity price
  const updateAmenityPrice = (id, price) => {
    setAmenities(amenities.map((amenity) => (amenity.id === id ? { ...amenity, price } : amenity)))
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError("")
    setSubmitSuccess(false)

    try {
      // Upload hero images to Firebase Storage
      const heroImagePromises = heroImages.map(async (image, index) => {
        if (image.file) {
          const path = `villas/${villaName.replace(/\s+/g, "-").toLowerCase()}/hero-${index + 1}`
          const imageUrl = await uploadImage(image.file, path)
          return { ...image, url: imageUrl }
        }
        return image
      })

      const uploadedHeroImages = await Promise.all(heroImagePromises)

      // Upload space images to Firebase Storage
      const spacesPromises = spaces.map(async (space) => {
        if (space.image) {
          const path = `villas/${villaName.replace(/\s+/g, "-").toLowerCase()}/spaces/${space.title.replace(/\s+/g, "-").toLowerCase()}`
          const imageUrl = await uploadImage(space.image, path)
          return { ...space, imageUrl }
        }
        return {
          ...space,
          imageUrl: space.imageUrl || space.imagePreview,
        }
      })

      const uploadedSpaces = await Promise.all(spacesPromises)

      // Construct the villa data object
      const villaData = {
        id: params.id, // Include the ID for updating
        villaName,
        location,
        collection,
        rating,
        guestFavorite,
        maxGuests,
        rooms,
        baths,
        mealsAvailable,
        checkInTime,
        checkOutTime,
        originalPrice,
        discountedPrice,
        description,
        heroImages: uploadedHeroImages.map((img) => ({
          id: img.id,
          name: img.name,
          url: img.url || img.preview,
        })),
        amenities: amenities
          .filter((amenity) => amenity.selected)
          .map((amenity) => ({
            id: amenity.id,
            label: amenity.label,
            icon: amenity.icon,
            price: amenity.price,
          })),
        spaces: uploadedSpaces.map((space) => ({
          id: space.id,
          title: space.title,
          imageUrl: space.imageUrl || space.imagePreview,
          details: space.details,
        })),
        reviews,
        mealsInfo,
        experiences,
        faqs,
        updatedAt: new Date().toISOString(),
      }

      // Save to Firebase
      await saveVilla(villaData, true) // Pass true to indicate this is an update

      setSubmitSuccess(true)

      // Scroll to top to show success message
      window.scrollTo(0, 0)

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/admin/villas")
      }, 2000)
    } catch (error) {
      console.error("Error updating villa:", error)
      setSubmitError("Failed to update villa data. Please try again.")
      window.scrollTo(0, 0)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex">
        <AdminDrawer isDrawerOpen={isDrawerOpen} toggleDrawer={() => setIsDrawerOpen(!isDrawerOpen)} />
        <div
          className="container mx-auto py-8 px-4"
          style={{
            width: isDrawerOpen ? "calc(100% - 12rem)" : "calc(100% - 3.5rem)",
            marginLeft: isDrawerOpen ? "12rem" : "3.5rem",
          }}
        >
          <h1 className="text-3xl font-bold mb-8">Loading...</h1>
          <div className="space-y-4">
            <div className="h-12 w-full bg-gray-200 animate-pulse rounded"></div>
            <div className="h-64 w-full bg-gray-200 animate-pulse rounded"></div>
            <div className="h-64 w-full bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex">
      <AdminDrawer isDrawerOpen={isDrawerOpen} toggleDrawer={() => setIsDrawerOpen(!isDrawerOpen)} />
      <div
        className="container mx-auto py-8 px-4"
        style={{
          width: isDrawerOpen ? "calc(100% - 12rem)" : "calc(100% - 3.5rem)",
          marginLeft: isDrawerOpen ? "12rem" : "3.5rem",
        }}
      >
        <div className="flex items-center mb-6">
          <button
            onClick={() => router.push("/admin/villas")}
            className="mr-4 p-2 flex items-center justify-center text-gray-700 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Villas
          </button>
          <h1 className="text-3xl font-bold">Edit Villa</h1>
        </div>

        {loadError && <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">{loadError}</div>}

        {submitSuccess && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            Villa updated successfully! Redirecting...
          </div>
        )}

        {submitError && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">{submitError}</div>
        )}

        {isLoading ? (
          <div className="space-y-4">
            <div className="h-12 w-full bg-gray-200 animate-pulse rounded"></div>
            <div className="h-64 w-full bg-gray-200 animate-pulse rounded"></div>
            <div className="h-64 w-full bg-gray-200 animate-pulse rounded"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Tabs */}
            <div className="mb-8">
              <div className="grid grid-cols-7 border-b">
                {["basic", "images", "amenities", "spaces", "reviews", "meals", "faqs"].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`py-2 px-4 text-center transition-colors duration-200 ${
                      activeTab === tab
                        ? "border-b-2 border-blue-500 text-blue-600 font-medium"
                        : "text-gray-600 hover:text-blue-500"
                    }`}
                  >
                    {tab === "basic" && "Basic Info"}
                    {tab === "images" && "Images"}
                    {tab === "amenities" && "Amenities"}
                    {tab === "spaces" && "Spaces"}
                    {tab === "reviews" && "Reviews"}
                    {tab === "meals" && "Meals & Experiences"}
                    {tab === "faqs" && "FAQs"}
                  </button>
                ))}
              </div>
            </div>

            {/* Basic Information Tab */}
            {activeTab === "basic" && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4 border-b pb-2">Basic Villa Information</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="villaName" className="block text-sm font-medium text-gray-700">
                        Villa Name
                      </label>
                      <input
                        id="villaName"
                        type="text"
                        value={villaName}
                        onChange={(e) => setVillaName(e.target.value)}
                        placeholder="e.g. Amalia by Tellado"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                        Location
                      </label>
                      <input
                        id="location"
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Assagao, Goa"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="collection" className="block text-sm font-medium text-gray-700">
                      Collection*
                    </label>
                    <select
                      id="collection"
                      value={collection}
                      onChange={(e) => setCollection(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select a Collection</option>
                      {collections.map((col) => (
                        <option key={col.id} value={col.id}>
                          {col.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
                        Rating (out of 5)
                      </label>
                      <input
                        id="rating"
                        type="number"
                        min="1"
                        max="5"
                        step="0.1"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="guestFavorite" className="block text-sm font-medium text-gray-700">
                        Guest Favorite
                      </label>
                      <div className="flex items-center space-x-2 pt-2">
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                          <input
                            type="checkbox"
                            id="guestFavorite"
                            checked={guestFavorite}
                            onChange={() => setGuestFavorite(!guestFavorite)}
                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                          />
                          <label
                            htmlFor="guestFavorite"
                            className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                              guestFavorite ? "bg-blue-500" : "bg-gray-300"
                            }`}
                          ></label>
                        </div>
                        <span className="text-sm text-gray-700">{guestFavorite ? "Yes" : "No"}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="mealsAvailable" className="block text-sm font-medium text-gray-700">
                        Meals Available
                      </label>
                      <div className="flex items-center space-x-2 pt-2">
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                          <input
                            type="checkbox"
                            id="mealsAvailable"
                            checked={mealsAvailable}
                            onChange={() => setMealsAvailable(!mealsAvailable)}
                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                          />
                          <label
                            htmlFor="mealsAvailable"
                            className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                              mealsAvailable ? "bg-blue-500" : "bg-gray-300"
                            }`}
                          ></label>
                        </div>
                        <span className="text-sm text-gray-700">{mealsAvailable ? "Yes" : "No"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="maxGuests" className="block text-sm font-medium text-gray-700">
                        Maximum Guests
                      </label>
                      <input
                        id="maxGuests"
                        type="number"
                        min="1"
                        value={maxGuests}
                        onChange={(e) => setMaxGuests(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="rooms" className="block text-sm font-medium text-gray-700">
                        Number of Rooms
                      </label>
                      <input
                        id="rooms"
                        type="number"
                        min="1"
                        value={rooms}
                        onChange={(e) => setRooms(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="baths" className="block text-sm font-medium text-gray-700">
                        Number of Bathrooms
                      </label>
                      <input
                        id="baths"
                        type="number"
                        min="1"
                        value={baths}
                        onChange={(e) => setBaths(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="checkInTime" className="block text-sm font-medium text-gray-700">
                        Check-in Time
                      </label>
                      <input
                        id="checkInTime"
                        type="text"
                        value={checkInTime}
                        onChange={(e) => setCheckInTime(e.target.value)}
                        placeholder="e.g. 2PM"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="checkOutTime" className="block text-sm font-medium text-gray-700">
                        Check-out Time
                      </label>
                      <input
                        id="checkOutTime"
                        type="text"
                        value={checkOutTime}
                        onChange={(e) => setCheckOutTime(e.target.value)}
                        placeholder="e.g. 11AM"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700">
                        Original Price (₹)
                      </label>
                      <input
                        id="originalPrice"
                        type="text"
                        value={originalPrice}
                        onChange={(e) => setOriginalPrice(e.target.value)}
                        placeholder="e.g. 52912"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="discountedPrice" className="block text-sm font-medium text-gray-700">
                        Discounted Price (₹)
                      </label>
                      <input
                        id="discountedPrice"
                        type="text"
                        value={discountedPrice}
                        onChange={(e) => setDiscountedPrice(e.target.value)}
                        placeholder="e.g. 44087"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Villa Description
                    </label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter a detailed description of the villa..."
                      rows={5}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Images Tab */}
            {activeTab === "images" && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4 border-b pb-2">Villa Images</h2>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Hero Images</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {heroImages.map((image, index) => (
                        <div key={image.id} className="space-y-2 border p-4 rounded-md">
                          <label className="block text-sm font-medium text-gray-700">{image.name}</label>
                          <div className="aspect-video relative bg-gray-100 rounded-md overflow-hidden">
                            <img
                              src={image.preview || "/placeholder.svg"}
                              alt={image.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, index, "hero")}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          />
                          {image.url && (
                            <p className="text-xs text-gray-500 mt-1">
                              Current image will be kept unless you upload a new one
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Amenities Tab */}
            {activeTab === "amenities" && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4 border-b pb-2">Villa Amenities</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {amenities.map((amenity) => (
                    <div key={amenity.id} className="flex items-start space-x-4 border p-4 rounded-md">
                      <div className="flex items-center h-full">
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                          <input
                            type="checkbox"
                            id={`amenity-${amenity.id}`}
                            checked={amenity.selected}
                            onChange={() => toggleAmenity(amenity.id)}
                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                          />
                          <label
                            htmlFor={`amenity-${amenity.id}`}
                            className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                              amenity.selected ? "bg-blue-500" : "bg-gray-300"
                            }`}
                          ></label>
                        </div>
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-2">
                          <img
                            src={amenity.icon || "/placeholder.svg"}
                            alt={amenity.label}
                            className="w-8 h-8 object-contain"
                          />
                          <label htmlFor={`amenity-${amenity.id}`} className="text-sm font-medium text-gray-700">
                            {amenity.label}
                          </label>
                        </div>
                        {amenity.selected && (
                          <div className="space-y-1">
                            <label
                              htmlFor={`amenity-price-${amenity.id}`}
                              className="block text-xs font-medium text-gray-700"
                            >
                              Additional Price (if any)
                            </label>
                            <input
                              id={`amenity-price-${amenity.id}`}
                              type="text"
                              value={amenity.price}
                              onChange={(e) => updateAmenityPrice(amenity.id, e.target.value)}
                              placeholder="e.g. 3,500"
                              className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Spaces Tab */}
            {activeTab === "spaces" && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex flex-row items-center justify-between mb-4 border-b pb-2">
                  <h2 className="text-xl font-semibold">Villa Spaces (Bedrooms)</h2>
                  <button
                    type="button"
                    onClick={addSpace}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Bedroom
                  </button>
                </div>
                <div className="space-y-8">
                  {spaces.map((space, spaceIndex) => (
                    <div key={space.id} className="border p-4 rounded-md space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">{space.title}</h3>
                        <button
                          type="button"
                          onClick={() => removeSpace(space.id)}
                          className="inline-flex items-center px-2 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label
                            htmlFor={`space-title-${space.id}`}
                            className="block text-sm font-medium text-gray-700"
                          >
                            Bedroom Title
                          </label>
                          <input
                            id={`space-title-${space.id}`}
                            type="text"
                            value={space.title}
                            onChange={(e) => {
                              const updatedSpaces = [...spaces]
                              updatedSpaces[spaceIndex].title = e.target.value
                              setSpaces(updatedSpaces)
                            }}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">Bedroom Image</label>
                          <div className="aspect-video relative bg-gray-100 rounded-md overflow-hidden">
                            <img
                              src={space.imagePreview || "/placeholder.svg"}
                              alt={space.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, spaceIndex, "space")}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          />
                          {space.imageUrl && (
                            <p className="text-xs text-gray-500 mt-1">
                              Current image will be kept unless you upload a new one
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="block text-sm font-medium text-gray-700">Bedroom Details</label>
                          <button
                            type="button"
                            onClick={() => addSpaceDetail(space.id)}
                            className="inline-flex items-center px-2 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Detail
                          </button>
                        </div>

                        {space.details.map((detail, detailIndex) => (
                          <div key={detailIndex} className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={detail}
                              onChange={(e) => updateSpaceDetail(space.id, detailIndex, e.target.value)}
                              placeholder="Enter bedroom detail"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <button
                              type="button"
                              onClick={() => removeSpaceDetail(space.id, detailIndex)}
                              className="p-2 text-gray-500 hover:text-red-500 focus:outline-none"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === "reviews" && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex flex-row items-center justify-between mb-4 border-b pb-2">
                  <h2 className="text-xl font-semibold">Guest Reviews</h2>
                  <button
                    type="button"
                    onClick={addReview}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Review
                  </button>
                </div>
                <div className="space-y-6">
                  {reviews.map((review, index) => (
                    <div key={review.id} className="border p-4 rounded-md space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">Review #{index + 1}</h3>
                        <button
                          type="button"
                          onClick={() => removeReview(review.id)}
                          className="inline-flex items-center px-2 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label
                            htmlFor={`review-name-${review.id}`}
                            className="block text-sm font-medium text-gray-700"
                          >
                            Guest Name
                          </label>
                          <input
                            id={`review-name-${review.id}`}
                            type="text"
                            value={review.name}
                            onChange={(e) => {
                              const updatedReviews = [...reviews]
                              updatedReviews[index].name = e.target.value
                              setReviews(updatedReviews)
                            }}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <label
                            htmlFor={`review-text-${review.id}`}
                            className="block text-sm font-medium text-gray-700"
                          >
                            Review Text
                          </label>
                          <textarea
                            id={`review-text-${review.id}`}
                            value={review.review}
                            onChange={(e) => {
                              const updatedReviews = [...reviews]
                              updatedReviews[index].review = e.target.value
                              setReviews(updatedReviews)
                            }}
                            rows={3}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Meals & Experiences Tab */}
            {activeTab === "meals" && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4 border-b pb-2">Meals & Experiences</h2>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Meals Information</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="meals-description1" className="block text-sm font-medium text-gray-700">
                          Meals Description (Part 1)
                        </label>
                        <textarea
                          id="meals-description1"
                          value={mealsInfo.description1}
                          onChange={(e) => setMealsInfo({ ...mealsInfo, description1: e.target.value })}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="meals-description2" className="block text-sm font-medium text-gray-700">
                          Meals Description (Part 2)
                        </label>
                        <textarea
                          id="meals-description2"
                          value={mealsInfo.description2}
                          onChange={(e) => setMealsInfo({ ...mealsInfo, description2: e.target.value })}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Experiences</h3>
                    <div className="space-y-2">
                      <label htmlFor="experiences" className="block text-sm font-medium text-gray-700">
                        Experiences Description
                      </label>
                      <textarea
                        id="experiences"
                        value={experiences}
                        onChange={(e) => setExperiences(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* FAQs Tab */}
            {activeTab === "faqs" && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex flex-row items-center justify-between mb-4 border-b pb-2">
                  <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
                  <button
                    type="button"
                    onClick={addFaq}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add FAQ
                  </button>
                </div>
                <div className="space-y-6">
                  {faqs.map((faq, index) => (
                    <div key={faq.id} className="border p-4 rounded-md space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">FAQ #{index + 1}</h3>
                        <button
                          type="button"
                          onClick={() => removeFaq(faq.id)}
                          className="inline-flex items-center px-2 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label htmlFor={`faq-question-${faq.id}`} className="block text-sm font-medium text-gray-700">
                            Question
                          </label>
                          <input
                            id={`faq-question-${faq.id}`}
                            type="text"
                            value={faq.question}
                            onChange={(e) => {
                              const updatedFaqs = [...faqs]
                              updatedFaqs[index].question = e.target.value
                              setFaqs(updatedFaqs)
                            }}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor={`faq-answer-${faq.id}`} className="block text-sm font-medium text-gray-700">
                            Answer
                          </label>
                          <textarea
                            id={`faq-answer-${faq.id}`}
                            value={faq.answer}
                            onChange={(e) => {
                              const updatedFaqs = [...faqs]
                              updatedFaqs[index].answer = e.target.value
                              setFaqs(updatedFaqs)
                            }}
                            rows={3}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.push("/admin/villas")}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Saving..." : "Update Villa"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

