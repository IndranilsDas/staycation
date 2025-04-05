"use client"

import { useEffect, useState } from "react";
import BestRated from "../components/best_rated";
import CollectionCarousel from "../components/collections";
import Destinations from "../components/destinations";
import Features from "../components/features";
import Footer from "../components/footer";
import Nav from "../components/nav";
import Offers from "../components/offers";
import StayLikeStars from "../components/stars";
import Stats from "../components/stats";
import Titlescreen from "../components/title";
import TrendingSection from "../components/trending";


export default function Landing() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time for Firebase initialization
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-xl">Loading StayVista...</p>
        </div>
      </div>
    )
  }

  return (
    <section>
      <Nav />
      <Titlescreen />
      <Destinations />
      <Offers />
      <TrendingSection />
      {/*<Banner1/>*/}
      <CollectionCarousel />
      <Features />
      <BestRated />
      <StayLikeStars />
      <Stats />
      <Footer />
    </section>
  )
}

