"use client"
import { useState, useEffect } from "react"
import { uploadImage, saveCollection, fetchAllVillas } from "../../../../lib/firebase"
import AdminDrawer from "../../../../components/admin/drawer"

export default function AdminCollectionForm() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState("/placeholder.svg")
  const [selectedVillas, setSelectedVillas] = useState([])
  const [villas, setVillas] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  // Fetch all villas for assignment
  useEffect(() => {
    async function loadVillas() {
      try {
        const allVillas = await fetchAllVillas()
        setVillas(allVillas)
      } catch (error) {
        console.error("Error fetching villas:", error)
      }
    }
    loadVillas()
  }, [])

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (event) => setImagePreview(event.target.result)
      reader.readAsDataURL(file)
    }
  }

  const toggleVillaSelection = (villaId) => {
    setSelectedVillas((prev) =>
      prev.includes(villaId)
        ? prev.filter((id) => id !== villaId)
        : [...prev, villaId]
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError("")
    setSubmitSuccess(false)
    try {
      // Upload the collection image if provided
      let imageUrl = ""
      if (imageFile) {
        // Create a storage path based on the collection title
        const path = `collections/${title.replace(/\s+/g, "-").toLowerCase()}`
        imageUrl = await uploadImage(imageFile, path)
      }
      // Construct the collection data object.
      // The "villas" field is an array of villa IDs assigned to this collection.
      const collectionData = {
        title,
        description,
        image: imageUrl,
        createdAt: new Date().toISOString(),
        villas: selectedVillas,
      }
      await saveCollection(collectionData)
      setSubmitSuccess(true)
      // Reset form fields
      setTitle("")
      setDescription("")
      setImageFile(null)
      setImagePreview("/placeholder.svg")
      setSelectedVillas([])
    } catch (error) {
      console.error("Error saving collection:", error)
      setSubmitError("Failed to save collection. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex">
    <AdminDrawer isDrawerOpen={isDrawerOpen} toggleDrawer={() => setIsDrawerOpen(!isDrawerOpen)} />  
    <div className="container mx-auto py-8 px-4"
    style={{
      width: isDrawerOpen ? "calc(100% - 12rem)" : "calc(100% - 3.5rem)",
      marginLeft: isDrawerOpen ? "12rem" : "3.5rem",
    }}>
      <h1 className="text-3xl font-bold mb-8">Add New Collection</h1>

      {submitSuccess && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          Collection added successfully!
        </div>
      )}

      {submitError && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Collection Information */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">Collection Information</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Collection Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>
            <div className="space-y-2">
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                Collection Image
              </label>
              <img src={imagePreview} alt="Collection Preview" className="mb-2 w-full h-auto rounded" />
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Assign Villas to Collection */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">Assign Villas to Collection</h2>
          {villas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {villas.map((villa) => (
                <div key={villa.id} className="flex items-center space-x-3 border p-3 rounded-md">
                  <input
                    type="checkbox"
                    checked={selectedVillas.includes(villa.id)}
                    onChange={() => toggleVillaSelection(villa.id)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <div>
                    <p className="font-medium text-gray-800">{villa.villaName}</p>
                    <p className="text-sm text-gray-500">{villa.location}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No villas found.</p>
          )}
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <button
            type="button"
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
            {isSubmitting ? "Submitting..." : "Save Collection"}
          </button>
        </div>
      </form>
    </div>
    </div>
  )
}
