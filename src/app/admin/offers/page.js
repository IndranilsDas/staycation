"use client"

import { useState, useEffect } from "react"
import { PlusCircle, Trash2, Save, X, Edit2, Copy } from "lucide-react"
import { fetchOffers, db } from "../../../lib/firebase"
import AdminDrawer from "../../../components/admin/drawer"
import { collection, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore"

export default function OffersAdminPage() {
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingOffer, setEditingOffer] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isDrawerOpen, setIsDrawerOpen] = useState(true)
  const [activeFilter, setActiveFilter] = useState("All")

  useEffect(() => {
    const loadOffers = async () => {
      try {
        const offersData = await fetchOffers(activeFilter)
        setOffers(offersData)
      } catch (error) {
        console.error("Error loading offers:", error)
        setError("Failed to load offers data")
      } finally {
        setLoading(false)
      }
    }

    loadOffers()
  }, [activeFilter])

  const handleAddOffer = async () => {
    if (!editingOffer) return

    setError("")
    setSaving(true)

    try {
      const offerData = {
        title: editingOffer.title,
        description: editingOffer.description,
        code: editingOffer.code,
        type: editingOffer.type,
      }

      if (editingOffer.id) {
        const offerRef = doc(db, "offers", editingOffer.id)
        await updateDoc(offerRef, offerData)

        const updatedOffers = offers.map((offer) =>
          offer.id === editingOffer.id ? { ...offerData, id: editingOffer.id } : offer
        )
        setOffers(updatedOffers)
        setSuccess("Offer updated successfully!")
      } else {
        const offersRef = collection(db, "offers")
        const docRef = await addDoc(offersRef, offerData)

        const newOffer = {
          id: docRef.id,
          ...offerData,
        }
        setOffers([...offers, newOffer])
        setSuccess("New offer added successfully!")
      }

      setEditingOffer(null)
      setShowForm(false)
    } catch (error) {
      console.error("Error saving offer:", error)
      setError("Failed to save offer. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const handleEditOffer = (offer) => {
    setEditingOffer(offer)
    setShowForm(true)
    setError("")
    setSuccess("")
  }

  const handleDeleteOffer = async (id) => {
    if (confirm("Are you sure you want to delete this offer?")) {
      try {
        const offerRef = doc(db, "offers", id)
        await deleteDoc(offerRef)

        setOffers(offers.filter((offer) => offer.id !== id))
        setSuccess("Offer deleted successfully!")
      } catch (error) {
        console.error("Error deleting offer:", error)
        setError("Failed to delete offer. Please try again.")
      }
    }
  }

  const handleNewOffer = () => {
    setEditingOffer({
      title: "",
      description: "",
      code: "",
      type: "stayvista_offer",
    })
    setShowForm(true)
    setError("")
    setSuccess("")
  }

  const handleCancelEdit = () => {
    setEditingOffer(null)
    setShowForm(false)
    setError("")
  }

  const copyCode = (code) => {
    navigator.clipboard.writeText(code)
    alert(`Copied: ${code}`)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  const filterTabs = [{ text: "All" }, { text: "Bank offers" }, { text: "StayVista offers" }]

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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Offers Manager</h1>
          <button
            onClick={handleNewOffer}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Add New Offer
          </button>
        </div>

        {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">{error}</div>}
        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">{success}</div>
        )}

        <div className="flex gap-3 overflow-x-auto mb-6">
          {filterTabs.map((item, index) => (
            <button
              key={index}
              onClick={() => setActiveFilter(item.text)}
              className={`px-4 py-2 rounded-full whitespace-nowrap border transition ${
                activeFilter === item.text
                  ? "bg-blue-100 text-blue-800 border-blue-200"
                  : "bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200"
              }`}
            >
              {item.text}
            </button>
          ))}
        </div>

        {showForm && (
          <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{editingOffer?.id ? "Edit Offer" : "Add New Offer"}</h2>
              <button onClick={handleCancelEdit} className="p-1 text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Offer Title</label>
                  <input
                    type="text"
                    value={editingOffer?.title || ""}
                    onChange={(e) => setEditingOffer({ ...editingOffer, title: e.target.value })}
                    placeholder="Enter offer title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Offer Type</label>
                  <select
                    value={editingOffer?.type || "stayvista_offer"}
                    onChange={(e) =>
                      setEditingOffer({
                        ...editingOffer,
                        type: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="bank_offer">Bank Offer</option>
                    <option value="stayvista_offer">StayVista Offer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Offer Code</label>
                  <input
                    type="text"
                    value={editingOffer?.code || ""}
                    onChange={(e) => setEditingOffer({ ...editingOffer, code: e.target.value })}
                    placeholder="Enter offer code"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Offer Description</label>
                  <textarea
                    value={editingOffer?.description || ""}
                    onChange={(e) => setEditingOffer({ ...editingOffer, description: e.target.value })}
                    placeholder="Enter offer description"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <button
                  onClick={handleAddOffer}
                  disabled={
                    saving || !editingOffer?.title || !editingOffer?.description || !editingOffer?.code
                  }
                  className={`flex items-center justify-center w-full px-4 py-2 text-white rounded-md transition-colors ${
                    saving || !editingOffer?.title || !editingOffer?.description || !editingOffer?.code
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
                      {editingOffer?.id ? "Update Offer" : "Add Offer"}
                    </>
                  )}
                </button>
              </div>

              <div className="flex flex-col">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Preview</h3>
                <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{editingOffer?.title || "Offer Title"}</h3>
                    <span className="text-xs text-gray-500 capitalize">
                      {editingOffer?.type === "bank_offer" ? "Bank Offer" : "StayVista Offer"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">
                    {editingOffer?.description || "Offer description will appear here"}
                  </p>
                  <p className="text-xs text-gray-400">*T&C apply</p>

                  <div className="flex items-center justify-between mt-4">
                    <div className="bg-gray-200 text-gray-800 font-mono px-2 py-1 rounded text-sm">
                      {editingOffer?.code || "CODE"}
                    </div>
                    <button className="bg-black text-white text-sm px-3 py-1 rounded hover:bg-gray-800">
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <div key={offer.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{offer.title}</h3>
                <span className="text-xs text-gray-500 capitalize">
                  {offer.type === "bank_offer" ? "Bank Offer" : "StayVista Offer"}
                </span>
              </div>

              <p className="text-sm text-gray-700 mb-3">{offer.description}</p>
              <p className="text-xs text-gray-400">*T&C apply</p>

              <div className="flex items-center justify-between mt-4 mb-4">
                <div className="bg-gray-200 text-gray-800 font-mono px-2 py-1 rounded text-sm">{offer.code}</div>
                <button
                  onClick={() => copyCode(offer.code)}
                  className="bg-black text-white text-sm px-3 py-1 rounded hover:bg-gray-800 flex items-center"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </button>
              </div>

              <div className="flex justify-between mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleEditOffer(offer)}
                  className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                >
                  <Edit2 className="mr-1 h-4 w-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteOffer(offer.id)}
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
    </div>
  )
}
