"use client"

import { useState, useEffect } from "react"
import { PlusCircle, Trash2, Save, X, Edit2 } from "lucide-react"
import { uploadImage } from "../../lib/firebase"

export default function TitleSlideForm() {
  const [slides, setSlides] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingSlide, setEditingSlide] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [previewImage, setPreviewImage] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Load slides from local storage for demo purposes
  // In a real app, you would fetch from Firebase
  useEffect(() => {
    const storedSlides = localStorage.getItem("titleSlides")
    if (storedSlides) {
      setSlides(JSON.parse(storedSlides))
    } else {
      // Default slides if none exist
      const defaultSlides = [
        {
          id: "1",
          image: "/images/interior_living_room.jpg",
          title: "Launching Vista Residences",
          button: "Boutique City Stays",
        },
        {
          id: "2",
          image: "/images/interior_design_style.jpg",
          title: "Getaways At An Affordable",
          button: "Economy Stays For Everyone",
        },
        {
          id: "3",
          image: "/images/interior_design_furniture_glass.jpg",
          title: "Newly Launched Villas",
          button: "50% OFF on 2nd Night",
        },
        {
          id: "4",
          image: "/images/interior_style_design.jpg",
          title: "Introducing Vio",
          button: "Experience the Future of Luxury",
        },
      ]
      setSlides(defaultSlides)
      localStorage.setItem("titleSlides", JSON.stringify(defaultSlides))
    }
    setLoading(false)
  }, [])

  // Save slides to local storage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("titleSlides", JSON.stringify(slides))
    }
  }, [slides, loading])

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

  const handleAddSlide = async () => {
    if (!editingSlide) return

    setError("")
    setSaving(true)

    try {
      let imageUrl = editingSlide.image

      // Upload image if a new one was selected
      if (imageFile) {
        const path = `slides/${Date.now()}-${imageFile.name}`
        imageUrl = await uploadImage(imageFile, path)
      }

      if (editingSlide.id) {
        // Update existing slide
        const updatedSlides = slides.map((slide) =>
          slide.id === editingSlide.id ? { ...editingSlide, image: imageUrl } : slide,
        )
        setSlides(updatedSlides)
        setSuccess("Slide updated successfully!")
      } else {
        // Add new slide
        const newSlide = {
          id: Date.now().toString(),
          image: imageUrl,
          title: editingSlide.title,
          button: editingSlide.button,
        }
        setSlides([...slides, newSlide])
        setSuccess("New slide added successfully!")
      }

      // Reset form
      setEditingSlide(null)
      setPreviewImage(null)
      setImageFile(null)
      setShowForm(false)
    } catch (error) {
      console.error("Error saving slide:", error)
      setError("Failed to save slide. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const handleEditSlide = (slide) => {
    setEditingSlide(slide)
    setPreviewImage(slide.image)
    setShowForm(true)
    setError("")
    setSuccess("")
  }

  const handleDeleteSlide = (id) => {
    if (confirm("Are you sure you want to delete this slide?")) {
      setSlides(slides.filter((slide) => slide.id !== id))
      setSuccess("Slide deleted successfully!")
    }
  }

  const handleNewSlide = () => {
    setEditingSlide({ image: "", title: "", button: "" })
    setPreviewImage(null)
    setImageFile(null)
    setShowForm(true)
    setError("")
    setSuccess("")
  }

  const handleCancelEdit = () => {
    setEditingSlide(null)
    setPreviewImage(null)
    setImageFile(null)
    setShowForm(false)
    setError("")
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Title Screen Slides Manager</h1>
        <button
          onClick={handleNewSlide}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Add New Slide
        </button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">{error}</div>}

      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">{success}</div>
      )}

      {showForm && (
        <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{editingSlide?.id ? "Edit Slide" : "Add New Slide"}</h2>
            <button onClick={handleCancelEdit} className="p-1 text-gray-500 hover:text-gray-700">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slide Title</label>
                <input
                  type="text"
                  value={editingSlide?.title || ""}
                  onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })}
                  placeholder="Enter slide title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                <input
                  type="text"
                  value={editingSlide?.button || ""}
                  onChange={(e) => setEditingSlide({ ...editingSlide, button: e.target.value })}
                  placeholder="Enter button text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slide Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="mt-1 text-xs text-gray-500">Recommended size: 1920x1080px or similar aspect ratio</p>
              </div>

              <button
                onClick={handleAddSlide}
                disabled={
                  saving || !editingSlide?.title || !editingSlide?.button || (!previewImage && !editingSlide?.image)
                }
                className={`flex items-center justify-center w-full px-4 py-2 text-white rounded-md transition-colors ${
                  saving || !editingSlide?.title || !editingSlide?.button || (!previewImage && !editingSlide?.image)
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-5 w-5" />
                    {editingSlide?.id ? "Update Slide" : "Add Slide"}
                  </>
                )}
              </button>
            </div>

            <div className="flex flex-col items-center">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Preview</h3>
              <div className="relative w-full h-64 bg-gray-200 rounded-md overflow-hidden">
                {previewImage ? (
                  <img
                    src={previewImage || "/placeholder.svg"}
                    alt="Slide preview"
                    className="w-full h-full object-cover"
                  />
                ) : editingSlide?.image ? (
                  <img
                    src={editingSlide.image || "/placeholder.svg"}
                    alt="Current slide"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">No image selected</div>
                )}
                <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white text-center">
                  <h1 className="text-2xl md:text-4xl font-bold">{editingSlide?.title || "Slide Title"}</h1>
                  <button className="mt-4 px-6 py-2 bg-[rgba(1,0,9,0.4)] hover:bg-orange-300 cursor-pointer hover:text-black duration-300 text-white ring ring-white rounded-md">
                    {editingSlide?.button || "Button Text"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {slides.map((slide) => (
          <div key={slide.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-48">
              <img src={slide.image || "/placeholder.svg"} alt={slide.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white text-center p-4">
                <h3 className="text-xl font-bold">{slide.title}</h3>
                <p className="mt-2 text-sm bg-[rgba(1,0,9,0.4)] px-3 py-1 rounded-md">{slide.button}</p>
              </div>
            </div>
            <div className="p-4 flex justify-between">
              <button
                onClick={() => handleEditSlide(slide)}
                className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
              >
                <Edit2 className="mr-1 h-4 w-4" />
                Edit
              </button>
              <button
                onClick={() => handleDeleteSlide(slide.id)}
                className="flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
              >
                <Trash2 className="mr-1 h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

