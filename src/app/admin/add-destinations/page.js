"use client"
import { useState } from "react"
import { addDoc, collection } from "firebase/firestore"
import { uploadImage, db } from "../../../lib/firebase"
import AdminDrawer from "../../../components/admin/drawer"

export default function DestinationsAdmin() {
  const [destinationName, setDestinationName] = useState("")
  const [imageFile, setImageFile] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isDrawerOpen, setIsDrawerOpen] = useState(true)

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (event) => {
        setPreviewImage(event.target?.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddDestination = async (e) => {
    e.preventDefault()
    if (!destinationName || !imageFile) {
      setError("Please provide both a destination name and an image.")
      return
    }
    setError("")
    setSaving(true)
    try {
      // Upload the image to Firebase Storage
      const imagePath = `destinations/${Date.now()}-${imageFile.name}`
      const imageUrl = await uploadImage(imageFile, imagePath)
      
      // Create the destination document
      const newDestination = {
        place: destinationName,
        image: imageUrl,
        createdAt: new Date()
      }
      
      await addDoc(collection(db, "destinations"), newDestination)
      setSuccess("Destination added successfully!")
      setDestinationName("")
      setImageFile(null)
      setPreviewImage(null)
    } catch (err) {
      console.error("Error adding destination:", err)
      setError("Error adding destination. Please try again.")
    }
    setSaving(false)
  }

  return (
    <div className="flex">
      <AdminDrawer
        isDrawerOpen={isDrawerOpen}
        toggleDrawer={() => setIsDrawerOpen(!isDrawerOpen)}
      />
      <div
        className="container mx-auto py-8 px-4"
        style={{
          width: isDrawerOpen ? "calc(100% - 12rem)" : "calc(100% - 3.5rem)",
          marginLeft: isDrawerOpen ? "12rem" : "3.5rem",
        }}
      >
        <h1 className="text-2xl font-bold mb-6">Add New Destination</h1>
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
            {success}
          </div>
        )}
        <form onSubmit={handleAddDestination} className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Destination Name
            </label>
            <input
              type="text"
              value={destinationName}
              onChange={(e) => setDestinationName(e.target.value)}
              placeholder="Enter destination name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Destination Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              required
            />
          </div>
          {previewImage && (
            <div className="mb-4">
              <img src={previewImage} alt="Preview" className="w-32 h-32 object-cover rounded-md" />
            </div>
          )}
          <button
            type="submit"
            disabled={saving}
            className={`flex items-center justify-center w-full px-4 py-2 text-white rounded-md transition-colors ${
              saving ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              "Add Destination"
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
