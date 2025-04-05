"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fetchCollectionById, fetchVillasByCollection } from "../../../lib/firebase";
import { Star, Users, Bed, Bath, Heart, MapPin } from "lucide-react";
import { Philosopher } from "next/font/google";

const philosopher = Philosopher({
  subsets: ["latin"],
  weight: ["400", "700"],
})


export default function CollectionPage() {
  const params = useParams();
  const collectionId = params?.id;

  const [collection, setCollection] = useState(null);
  const [villas, setVillas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("Collection ID:", collectionId);

  useEffect(() => {
    if (!collectionId) {
      setError("Invalid collection ID.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch collection data
        const collectionData = await fetchCollectionById(collectionId);
        if (!collectionData) throw new Error("Collection not found.");

        setCollection(collectionData);

        // Fetch villas
        const villasData = await fetchVillasByCollection(collectionId);
        setVillas(villasData || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load collection details.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [collectionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !collection) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">{error || "Collection not found"}</h1>
        <Link href="/" className="text-primary hover:underline">
          Return to home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[40vh] md:h-[50vh] w-full overflow-hidden">
        <img
          src={collection.image || "/placeholder.svg"}
          alt={collection.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6 md:p-12">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{collection.name}</h1>
          <p className={`${philosopher.className} text-white/90 text-5xl md:text-6xl max-w-3xl`}>{collection.description}</p>philosopher
        </div>
      </div>

      {/* Location Filters */}
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-wrap gap-2">
        {["All", "Uttarakhand", "Uttar Pradesh", "Delhi", "Maharashtra", "Rajasthan"].map(
          (location) => (
            <button
              key={location}
              className="border border-gray-300 rounded-full px-4 py-2 text-sm hover:bg-gray-200"
            >
              {location}
            </button>
          )
        )}
      </div>

      {/* Villas Listing */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">
          {villas.length} {villas.length === 1 ? "Villa" : "Villas"} Available
        </h2>

        {villas.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">No villas found in this collection.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {villas.map((villa) => (
              <Link href={`/villas/${villa.id}`} key={villa.id}>
                <div className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                  {/* Villa Image */}
                  <div className="relative h-64 w-full overflow-hidden">
                    <img
                      src={villa.heroImages?.[0]?.url || "/placeholder.svg"}
                      alt={villa.villaName}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <button className="absolute top-4 right-4 bg-white/80 p-2 rounded-full hover:bg-white transition-colors">
                      <Heart className="h-5 w-5 text-gray-700" />
                    </button>
                  </div>

                  {/* Villa Details */}
                  <div className="p-4">
                    {/* Location & Rating */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-500 mr-1" />
                        <p className="text-sm text-gray-500">{villa.location?.split(",")[0]}</p>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                        <span className="text-sm font-medium">
                          {parseFloat(villa.rating || "0").toFixed(1)}
                        </span>
                      </div>
                    </div>

                    {/* Villa Name */}
                    <h3 className="font-bold text-lg mb-2 line-clamp-1">{villa.villaName}</h3>

                    {/* Feature Tags */}
                    <p className="text-xs bg-gray-200 rounded-full px-3 py-1 w-fit mb-2">
                      {villa.features?.[0] || "Feature"}
                    </p>

                    {/* Price and Amenities */}
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-lg font-bold text-gray-900">
                        ₹{parseInt(villa.discountedPrice || "0").toLocaleString("en-IN")}
                        <span className="text-sm text-gray-500"> / night + Taxes</span>
                      </p>
                      {villa.originalPrice && (
                        <p className="text-sm text-gray-500 line-through">
                          ₹{parseInt(villa.originalPrice).toLocaleString("en-IN")}
                        </p>
                      )}
                    </div>

                    {/* Amenities */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-gray-500 mr-1" />
                        <span className="text-sm">{villa.maxGuests} Guests</span>
                      </div>
                      <div className="flex items-center">
                        <Bed className="h-4 w-4 text-gray-500 mr-1" />
                        <span className="text-sm">{villa.rooms} Rooms</span>
                      </div>
                      <div className="flex items-center">
                        <Bath className="h-4 w-4 text-gray-500 mr-1" />
                        <span className="text-sm">{villa.baths} Baths</span>
                      </div>
                    </div>

                    <button className="w-full bg-primary text-white font-bold py-2 rounded-lg">
                      View Villa
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
