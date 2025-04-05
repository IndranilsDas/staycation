"use client"

import { useState, useCallback, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import { v4 as uuidv4 } from "uuid"
import { saveVilla, uploadImage } from "../lib/firebase"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"

const VillaDataEntryForm = () => {
  const router = useRouter()
  
  // Form state
  const [activeTab, setActiveTab] = useState(1)
  const [villaName, setVillaName] = useState("")
  const [location, setLocation] = useState("")
  const [rating, setRating] = useState(5)
  const [guestFavorite, setGuestFavorite] = useState(false)
  const [maxGuests, setMaxGuests] = useState(2)
  const [rooms, setRooms] = useState(1)
  const [baths, setBaths] = useState(1)
  const [mealsAvailable, setMealsAvailable] = useState(true)
  const [collection, setCollection] = useState("romantic-getaways")
  const [checkInTime, setCheckInTime] = useState("14:00")
  const [checkOutTime, setCheckOutTime] = useState("11:00")
  const [originalPrice, setOriginalPrice] = useState(10000)
  const [discountedPrice, setDiscountedPrice] = useState(8000)
  const [description, setDescription] = useState("")
  const [amenities, setAmenities] = useState([])
  const [uploadedHeroImages, setUploadedHeroImages] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Available amenities
  const availableAmenities = [
    "Swimming Pool",
    "WiFi",
    "Air Conditioning",
    "Kitchen",
    "Parking",
    "TV",
    "Garden",
    "BBQ Area",
    "Pet Friendly",
    "Sea View"
  ]

  // Image upload handlers
  const onDropHero = useCallback((acceptedFiles) => {
    if (uploadedHeroImages.length + acceptedFiles.length > 10) {
      toast.error("Maximum 10 images allowed")
      return
    }

    setUploadedHeroImages((prevImages) => [
      ...prevImages,
      ...acceptedFiles.map((file) =>
        Object.assign(file, {
          id: uuidv4(),
          preview: URL.createObjectURL(file),
        })
      ),
    ])
  }, [uploadedHeroImages.length])

  const { getRootProps: getRootPropsHero, getInputProps: getInputPropsHero } = useDropzone({
    onDrop: onDropHero,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 10,
    maxSize: 5 * 1024 * 1024 // 5MB
  })

  const removeHeroImage = (id) => {
    setUploadedHeroImages((prevImages) => prevImages.filter((img) => img.id !== id))
  }

  // Amenity toggle
  const toggleAmenity = (amenity) => {
    setAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity) 
        : [...prev, amenity]
    )
  }

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (uploadedHeroImages.length === 0) {
      toast.error("Please upload at least one image")
      return
    }

    setIsSubmitting(true)

    try {
      // Upload images to Firebase Storage first
      const imageUploadPromises = uploadedHeroImages.map(async (img) => {
        const imagePath = `villas/${uuidv4()}-${img.name}`
        const downloadURL = await uploadImage(img, imagePath)
        return {
          id: img.id,
          name: img.name,
          url: downloadURL
        }
      })

      const uploadedImages = await Promise.all(imageUploadPromises)

      // Prepare villa data
      const villaData = {
        villaName,
        location,
        rating: Number(rating),
        guestFavorite,
        maxGuests: Number(maxGuests),
        rooms: Number(rooms),
        baths: Number(baths),
        mealsAvailable,
        collection,
        checkInTime,
        checkOutTime,
        originalPrice: Number(originalPrice),
        discountedPrice: Number(discountedPrice),
        description,
        amenities,
        heroImages: uploadedImages,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      // Save to Firestore
      await saveVilla(villaData)
      
      toast.success("Villa added successfully!")
      router.push("/admin/villas")
    } catch (error) {
      console.error("Error saving villa:", error)
      toast.error(`Failed to add villa: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Clean up object URLs
  useEffect(() => {
    return () => {
      uploadedHeroImages.forEach(img => URL.revokeObjectURL(img.preview))
    }
  }, [uploadedHeroImages])

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6">Add New Villa</h1>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <button
                onClick={() => setActiveTab(step)}
                className={`w-8 h-8 rounded-full flex items-center justify-center 
                  ${activeTab === step ? 'bg-blue-600 text-white' : 
                  activeTab > step ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
              >
                {step}
              </button>
              {step < 3 && (
                <div className={`h-1 w-16 ${activeTab > step ? 'bg-green-500' : 'bg-gray-200'}`}></div>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-sm">
          <span className={activeTab === 1 ? "font-bold text-blue-600" : ""}>Basic Info</span>
          <span className={activeTab === 2 ? "font-bold text-blue-600" : ""}>Images</span>
          <span className={activeTab === 3 ? "font-bold text-blue-600" : ""}>Details</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tab 1: Basic Information */}
        {activeTab === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Villa Name*</label>
              <input
                type="text"
                value={villaName}
                onChange={(e) => setVillaName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Location*</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Collection*</label>
              <select
                value={collection}
                onChange={(e) => setCollection(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="" disabled>Select a collection</option> {/* Add default empty option */}
                <option value="romantic-getaways">Romantic Getaways</option>
                <option value="villas-for-wedding">Villas for Wedding</option>
                <option value="corporate-offset-villas">Corporate Offset Villas</option>
                <option value="economy-friendly">Economy Friendly</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Rating (1-5)*</label>
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                {[5, 4, 3, 2, 1].map(num => (
                  <option key={num} value={num}>{num} ★</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Max Guests*</label>
              <input
                type="number"
                min="1"
                value={maxGuests}
                onChange={(e) => setMaxGuests(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Bedrooms*</label>
              <input
                type="number"
                min="1"
                value={rooms}
                onChange={(e) => setRooms(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Bathrooms*</label>
              <input
                type="number"
                min="1"
                value={baths}
                onChange={(e) => setBaths(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="guestFavorite"
                  checked={guestFavorite}
                  onChange={(e) => setGuestFavorite(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="guestFavorite" className="ml-2 block text-sm text-gray-700">
                  Guest Favorite
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="mealsAvailable"
                  checked={mealsAvailable}
                  onChange={(e) => setMealsAvailable(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="mealsAvailable" className="ml-2 block text-sm text-gray-700">
                  Meals Available
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Images */}
        {activeTab === 2 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Hero Images* (Max 10)</label>
              <div
                {...getRootPropsHero()}
                className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
              >
                <input {...getInputPropsHero()} />
                <p className="text-gray-500">Drag & drop villa images here, or click to select</p>
                <p className="text-sm text-gray-400 mt-1">Recommended size: 1200x800px (Max 5MB each)</p>
              </div>
            </div>

            {uploadedHeroImages.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Uploaded Images ({uploadedHeroImages.length}/10)</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {uploadedHeroImages.map((img) => (
                    <div key={img.id} className="relative group">
                      <img
                        src={img.preview}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeHeroImage(img.id)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Pricing & Details */}
        {activeTab === 3 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Original Price (₹)*</label>
              <input
                type="number"
                min="0"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Discounted Price (₹)*</label>
              <input
                type="number"
                min="0"
                value={discountedPrice}
                onChange={(e) => setDiscountedPrice(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Check-in Time*</label>
              <input
                type="time"
                value={checkInTime}
                onChange={(e) => setCheckInTime(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Check-out Time*</label>
              <input
                type="time"
                value={checkOutTime}
                onChange={(e) => setCheckOutTime(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="block text-sm font-medium text-gray-700">Description*</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="block text-sm font-medium text-gray-700">Amenities</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {availableAmenities.map((amenity) => (
                  <div key={amenity} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`amenity-${amenity}`}
                      checked={amenities.includes(amenity)}
                      onChange={() => toggleAmenity(amenity)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`amenity-${amenity}`} className="ml-2 block text-sm text-gray-700">
                      {amenity}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between pt-6">
          {activeTab > 1 ? (
            <button
              type="button"
              onClick={() => setActiveTab(activeTab - 1)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Previous
            </button>
          ) : (
            <div></div>
          )}

          {activeTab < 3 ? (
            <button
              type="button"
              onClick={() => setActiveTab(activeTab + 1)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
            >
              {isSubmitting ? 'Saving...' : 'Save Villa'}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default VillaDataEntryForm