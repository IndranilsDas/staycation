"use client"

import { useState, useEffect } from "react"
import { PlusCircle, Trash2, Save, X, Edit2 } from "lucide-react"
import { fetchStars, uploadImage, db } from "../../../lib/firebase"
import AdminDrawer from "../../../components/admin/drawer"
import { collection, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore"

export default function StarsAdminPage() {
  const [stars, setStars] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingStar, setEditingStar] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [previewImage, setPreviewImage] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isDrawerOpen, setIsDrawerOpen] = useState(true)

  useEffect(() => {
    const loadStars = async () => {
      try {
        const starsData = await fetchStars()
        console.log("Fetched stars:", starsData)
        setStars(starsData)
      } catch (error) {
        console.error("Error loading stars:", error)
        setError("Failed to load celebrity stays data")
      } finally {
        setLoading(false)
      }
    }

    loadStars()
  }, [])

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

  const handleAddStar = async () => {
    if (!editingStar) return

    setError("")
    setSaving(true)

    try {
      let imageUrl = editingStar.image

      if (imageFile) {
        const path = `stars/${Date.now()}-${imageFile.name}`
        imageUrl = await uploadImage(imageFile, path)
      }

      const starData = {
        name: editingStar.name,
        location: editingStar.location,
        image: imageUrl,
      }

      if (editingStar.id) {
        const starRef = doc(db, "stars", editingStar.id)
        await updateDoc(starRef, starData)

        const updatedStars = stars.map((star) =>
          star.id === editingStar.id ? { ...starData, id: editingStar.id } : star
        )
        setStars(updatedStars)
        setSuccess("Celebrity stay updated successfully!")
      } else {
        const starsRef = collection(db, "stars")
        const docRef = await addDoc(starsRef, starData)

        const newStar = {
          id: docRef.id,
          ...starData,
        }
        setStars([...stars, newStar])
        setSuccess("New celebrity stay added successfully!")
      }

      setEditingStar(null)
      setPreviewImage(null)
      setImageFile(null)
      setShowForm(false)
    } catch (error) {
      console.error("Error saving celebrity stay:", error)
      setError("Failed to save celebrity stay. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const handleEditStar = (star) => {
    setEditingStar(star)
    setPreviewImage(star.image)
    setShowForm(true)
    setError("")
    setSuccess("")
  }

  const handleDeleteStar = async (id) => {
    if (confirm("Are you sure you want to delete this celebrity stay?")) {
      try {
        const starRef = doc(db, "stars", id)
        await deleteDoc(starRef)
        setStars(stars.filter((star) => star.id !== id))
        setSuccess("Celebrity stay deleted successfully!")
      } catch (error) {
        console.error("Error deleting celebrity stay:", error)
        setError("Failed to delete celebrity stay. Please try again.")
      }
    }
  }

  const handleNewStar = () => {
    setEditingStar({ image: "", name: "", location: "" })
    setPreviewImage(null)
    setImageFile(null)
    setShowForm(true)
    setError("")
    setSuccess("")
  }

  const handleCancelEdit = () => {
    setEditingStar(null)
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
    <div className="flex">
      <AdminDrawer isDrawerOpen={isDrawerOpen} toggleDrawer={() => setIsDrawerOpen(!isDrawerOpen)} />
      <div
        className="container mx-auto py-8 px-4 text-black"
        style={{
          width: isDrawerOpen ? "calc(100% - 12rem)" : "calc(100% - 3.5rem)",
          marginLeft: isDrawerOpen ? "12rem" : "3.5rem",
        }}
      >
        <h1 className="text-2xl font-bold mb-4">Celebrity Stays</h1>

        {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4">{success}</div>}

        <button
          onClick={handleNewStar}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
        >
          <PlusCircle size={18} />
          Add New
        </button>

        {showForm && editingStar && (
          <div className="mt-6 border rounded p-4 bg-white shadow">
            <h2 className="text-xl font-semibold mb-4">
              {editingStar.id ? "Edit Celebrity Stay" : "Add Celebrity Stay"}
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <input
                type="text"
                placeholder="Name"
                value={editingStar.name}
                onChange={(e) => setEditingStar({ ...editingStar, name: e.target.value })}
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                placeholder="Location"
                value={editingStar.location}
                onChange={(e) => setEditingStar({ ...editingStar, location: e.target.value })}
                className="border p-2 rounded w-full"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="col-span-1 md:col-span-2"
              />
              {previewImage && (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="col-span-1 md:col-span-2 w-48 h-32 object-cover rounded"
                />
              )}
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleAddStar}
                disabled={saving}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                <Save size={18} />
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                onClick={handleCancelEdit}
                className="flex items-center gap-2 bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
              >
                <X size={18} />
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {stars.map((star) => (
            <div key={star.id} className="border rounded p-4 shadow bg-white">
              <img src={star.image} alt={star.name} className="w-full h-40 object-cover rounded mb-2" />
              <h2 className="text-lg font-semibold">{star.name}</h2>
              <p className="text-gray-600">{star.location}</p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleEditStar(star)}
                  className="text-blue-600 hover:underline flex items-center gap-1"
                >
                  <Edit2 size={14} />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteStar(star.id)}
                  className="text-red-600 hover:underline flex items-center gap-1"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
