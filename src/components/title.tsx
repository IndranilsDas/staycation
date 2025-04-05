"use client";

import { useState, useEffect } from "react";
import { Prompt, Aladin } from "next/font/google";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { fetchVillaLocations } from "../lib/firebase"; // Adjust path as needed

const prompt = Prompt({
  subsets: ["latin"],
  weight: ["200", "300", "400", "600", "800"],
});

const aladin = Aladin({
  subsets: ["latin"],
  weight: "400",
});

export default function Titlescreen() {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const [isUnder850, setIsUnder850] = useState(false);
  const [loading, setLoading] = useState(true);
  const [villaLocations, setVillaLocations] = useState([]);

  const [selectedLocation, setSelectedLocation] = useState("");

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  useEffect(() => {
    const storedSlides = localStorage.getItem("titleSlides");
    if (storedSlides) {
      setSlides(JSON.parse(storedSlides));
    } else {
      setSlides([
        { id: "1", image: "/images/interior_living_room.jpg", title: "Launching Vista Residences", button: "Boutique City Stays" },
        { id: "2", image: "/images/interior_design_style.jpg", title: "Getaways At An Affordable", button: "Economy Stays For Everyone" },
        { id: "3", image: "/images/interior_design_furniture_glass.jpg", title: "Newly Launched Villas", button: "50% OFF on 2nd Night" },
        { id: "4", image: "/images/interior_style_design.jpg", title: "Introducing Vio", button: "Experience the Future of Luxury" },
      ]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsUnder850(window.innerWidth < 850);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchVillaLocations()
      .then((locations) => setVillaLocations(locations))
      .catch((err) => console.error("Error fetching villa locations:", err));
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[85vh] bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`${prompt.className} relative h-[85vh] overflow-hidden flex flex-col justify-center overflow-y-visible overflow-x-clip`}>
      <div className="flex transition-transform duration-500 ease-in-out bg-no-repeat bg-cover h-full w-full" style={{ transform: `translateX(-${current * 100}%)` }}>
        {slides.map((slide, index) => (
          <div key={slide.id || index} className="w-full flex-shrink-0 h-full">
            <img src={slide.image || "/placeholder.svg"} alt={`Slide ${index + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 p-3 rounded-full z-30 text-white">
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 p-3 rounded-full z-30 text-white">
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white text-center z-20">
        <h1 className={`${aladin.className} text-5xl md:text-8xl`}>{slides[current].title}</h1>
        <button className="mt-4 px-6 py-2 bg-[rgba(1,0,9,0.4)] hover:bg-orange-300 cursor-pointer hover:text-black duration-300 text-white ring ring-white rounded-md">
          {slides[current].button}
        </button>
      </div>

      {isUnder850 ? (
        <MobileInquiryForm />
      ) : (
        <DesktopInquiryForm
          calendarOpen={calendarOpen}
          setCalendarOpen={setCalendarOpen}
          selectedDates={selectedDates}
          setSelectedDates={setSelectedDates}
          villaLocations={villaLocations}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
        />
      )}
    </div>
  );
}

function DesktopInquiryForm({ calendarOpen, setCalendarOpen, selectedDates, setSelectedDates, villaLocations, selectedLocation, setSelectedLocation }) {
  return (
    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-[75vw] p-4 rounded-xl bg-white shadow-md z-40 text-black">
      <div className="grid grid-cols-2 md:flex flex-wrap items-center justify-between p-4 gap-2">
        <div className="flex flex-col min-w-[180px]">
          <label className="text-sm font-semibold mb-1">Location / Villas / Landmark</label>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="">Where To?</option>
            {villaLocations.map((location, index) => (
              <option key={index} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col min-w-[120px] relative">
          <label className="text-sm font-semibold mb-1">Check-in</label>
          <div onClick={() => setCalendarOpen(!calendarOpen)} className="p-2 border border-gray-300 rounded cursor-pointer bg-white">
            {selectedDates.startDate.toLocaleDateString()}
          </div>
          {calendarOpen && (
            <div className="absolute top-full left-0 mt-2 z-50 bg-white shadow-lg rounded p-2">
              <DateRange
                ranges={[selectedDates]}
                onChange={(range) => setSelectedDates(range.selection)}
                moveRangeOnFirstSelection={false}
                months={2}
                direction="horizontal"
                showPreview={true}
              />
            </div>
          )}
        </div>

        <div className="flex flex-col min-w-[120px]">
          <label className="text-sm font-semibold mb-1">Check-out</label>
          <div className="p-2 border border-gray-300 rounded bg-white">
            {selectedDates.endDate.toLocaleDateString()}
          </div>
        </div>

        <div className="flex flex-col min-w-[150px]">
          <label className="text-sm font-semibold mb-1">Guests</label>
          <input type="text" placeholder="2 Guests, 1+ Rooms" className="p-2 border border-gray-300 rounded" />
        </div>

        <button className="col-span-2 md:col-span-1 px-6 py-2 bg-black text-white rounded hover:bg-gray-800">SEARCH</button>
      </div>
    </div>
  );
}

function MobileInquiryForm() {
  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-[90%] p-4 rounded-xl bg-white shadow-md z-40 text-black">
      <input type="text" placeholder="Where To?" className="p-2 border border-gray-300 rounded w-full mb-2" />
      <button className="px-6 py-2 bg-black text-white rounded w-full">SEARCH</button>
    </div>
  );
}
