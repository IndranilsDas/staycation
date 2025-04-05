"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { fetchCollections, deleteCollection } from "../../../lib/firebase"
import AdminDrawer from "../../../components/admin/drawer"
import Link from "next/link"
import { Trash2, Edit, Eye, Plus } from "lucide-react"

export default function AdminCollectionsList() {
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isDrawerOpen, setIsDrawerOpen] = useState(true)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const router = useRouter()

  useEffect(() => {
    async function loadCollections() {
      try {
        setLoading(true)
        const allCollections = await fetchCollections()
        setCollections(allCollections)
        setError("")
      } catch (error) {
        console.error("Error fetching collections:", error)
        setError("Failed to load collections. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    loadCollections()
  }, [])

  const handleDelete = async (id) => {
    if (deleteConfirm === id) {
      try {
        await deleteCollection(id)
        setCollections(collections.filter((collection) => collection.id !== id))
        setDeleteConfirm(null)
      } catch (error) {
        console.error("Error deleting collection:", error)
        setError("Failed to delete collection. Please try again.")
      }
    } else {
      setDeleteConfirm(id)
    }
  }

  const cancelDelete = () => {
    setDeleteConfirm(null)
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Collections</h1>
          <Link
            href="/admin/collections/add_collections"
            className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Collection
          </Link>
        </div>

        {error && <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : collections.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 mb-4">No collections found.</p>
            <Link
              href="/admin/collections/add_collections"
              className="px-4 py-2 bg-blue-600 text-white rounded-md inline-flex items-center hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create your first collection
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Image
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Description
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Villas
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Created
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {collections.map((collection) => (
                    <tr key={collection.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-12 w-12 rounded overflow-hidden bg-gray-100">
                          {collection.image ? (
                            <img
                              src={collection.image || "/placeholder.svg"}
                              alt={collection.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-gray-400">No image</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{collection.title}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 truncate max-w-xs">{collection.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {collection.villas ? collection.villas.length : 0} villas
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(collection.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button className="text-blue-600 hover:text-blue-900" title="View">
                            <Eye className="w-5 h-5" />
                          </button>
                          <Link
                            href={`/admin/collections/edit/${collection.id}`}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Edit"
                          >
                            <Edit className="w-5 h-5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(collection.id)}
                            className={`${
                              deleteConfirm === collection.id
                                ? "text-red-600 bg-red-100 p-1 rounded"
                                : "text-red-600 hover:text-red-900"
                            }`}
                            title={deleteConfirm === collection.id ? "Confirm delete" : "Delete"}
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                          {deleteConfirm === collection.id && (
                            <button onClick={cancelDelete} className="text-gray-600 hover:text-gray-900" title="Cancel">
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

