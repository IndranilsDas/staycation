"use client";
import { useEffect, useState } from "react";
import { fetchVillas, deleteVilla } from "../../../lib/firebase";
import Link from "next/link";
import AdminDrawer from "../../../components/admin/drawer";

export default function VillaListFullFields() {
  const [villas, setVillas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true); // Single toggle state

  useEffect(() => {
    const getVillas = async () => {
      const villaData = await fetchVillas();
      setVillas(villaData);
      setLoading(false);
    };
    getVillas();
  }, []);

  const handleDelete = async (villaId) => {
    if (confirm("Are you sure you want to delete this villa?")) {
      await deleteVilla(villaId);
      setVillas(villas.filter((villa) => villa.id !== villaId));
    }
  };

  if (loading) return <p className="p-4">Loading villas...</p>;

  return (
    <div className="flex">
      {/* Drawer Component */}
      <AdminDrawer isDrawerOpen={isDrawerOpen} toggleDrawer={() => setIsDrawerOpen(!isDrawerOpen)} />

      {/* Main Content Adjusts Automatically */}
      <div
        className="p-6 transition-all duration-300"
        style={{
          width: isDrawerOpen ? "calc(100% - 12rem)" : "calc(100% - 3.5rem)",
          marginLeft: isDrawerOpen ? "12rem" : "3.5rem",
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Villa List (Full Fields)</h2>
          <Link
            href="/admin/villas/add_villas"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Add Villa
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-x-auto shadow rounded-lg">
          <table className="min-w-full border">
            <thead className="bg-gray-100 border-b sticky top-0 z-10">
              <tr className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-3 py-2">ID</th>
                <th className="px-3 py-2">Villa Name</th>
                <th className="px-3 py-2">Location</th>
                <th className="px-3 py-2">Collection</th>
                <th className="px-3 py-2">Created At</th>
                <th className="px-3 py-2">Description</th>
                <th className="px-3 py-2">Discounted Price</th>
                <th className="px-3 py-2">Original Price</th>
                <th className="px-3 py-2">Rating</th>
                <th className="px-3 py-2">Max Guests</th>
                <th className="px-3 py-2">Rooms</th>
                <th className="px-3 py-2">Baths</th>
                <th className="px-3 py-2">Check-In</th>
                <th className="px-3 py-2">Check-Out</th>
                <th className="px-3 py-2">Meals Avail.</th>
                <th className="px-3 py-2">Guest Fav.</th>
                <th className="px-3 py-2">Amenities</th>
                <th className="px-3 py-2">Experiences</th>
                <th className="px-3 py-2">FAQs</th>
                <th className="px-3 py-2">Reviews</th>
                <th className="px-3 py-2">Spaces</th>
                <th className="px-3 py-2">Hero Image</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white text-xs text-gray-700">
              {villas.map((villa) => (
                <tr key={villa.id} className="hover:bg-gray-50 transition">
                  <td className="px-3 py-2 whitespace-nowrap">{villa.id}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{villa.villaName}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{villa.location}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{villa.collection}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {villa.createdAt ? new Date(villa.createdAt).toLocaleString() : ""}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {villa.description?.slice(0, 50)}
                    {villa.description && villa.description.length > 50 ? "..." : ""}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">₹{villa.discountedPrice}</td>
                  <td className="px-3 py-2 whitespace-nowrap">₹{villa.originalPrice}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{villa.rating}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{villa.maxGuests}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{villa.rooms}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{villa.baths}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{villa.checkInTime}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{villa.checkOutTime}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{villa.mealsAvailable ? "Yes" : "No"}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{villa.guestFavorite ? "Yes" : "No"}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{villa.amenities ? villa.amenities.length : 0}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{villa.experiences?.slice(0, 30)}{villa.experiences && villa.experiences.length > 30 ? "..." : ""}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{villa.faqs ? villa.faqs.length : 0}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{villa.reviews ? villa.reviews.length : 0}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{villa.spaces ? villa.spaces.length : 0}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {villa.heroImages?.[0] ? (
                      <img src={villa.heroImages[0].url || villa.heroImages[0].preview} className="w-10 h-10 object-cover rounded" />
                    ) : "N/A"}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap space-x-2">
                    <Link href={`/admin/villas/edit_villa/${villa.id}`} className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Edit</Link>
                    <button onClick={() => handleDelete(villa.id)} className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
