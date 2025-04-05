'use client';

import React, { useState } from 'react';
import { Prompt } from 'next/font/google';

const prompt = Prompt({
  subsets: ['latin'],
  weight: ['200', '300', '400', '600', '800'],
});

const tabData = {
  Villas: [
    'Villas in Goa', 'Villas in Karjat', 'Villas in Pune', 'Villas in Panvel',
    'Villas in Khandala', 'Villas in Dahanu', 'Villas in Sakleshpur', 'Villas in Bandipur',
    'Villas in Nandi Hills', 'Villas in Malpe', 'Villas in South Goa', 'Villas in Lonavala',
    'Villas in Mumbai', 'Villas in Matheran', '+109 more'
  ],
  Homestays: [
    'Homestays in Alibaug', 'Homestays in Kashid', 'Homestays in Nashik', 'Homestays in Karjat',
    'Homestays in Goa', 'Homestays in Bhimtal', 'Homestays in Mussoorie', 'Homestays in Mukteshwar',
    'Homestays in Almora', 'Homestays in Mahabaleshwar', 'Homestays in Lavasa', 'Homestays in Mumbai',
    'Homestays in Panchgani', 'Homestays in Bhowali', '+127 more'
  ],
  Cottages: [
    'Cottages in Lonavala', 'Cottages in Bhowali', 'Cottages in Khandala', 'Cottages in Revdanda',
    'Cottages in Nashik', 'Cottages in Mumbai', 'Cottages in Baga', 'Cottages in Vagator',
    'Cottages in Lansdowne', 'Cottages in Ramgarh', 'Cottages in Mulshi', 'Cottages in Panvel',
    'Cottages in Alibaug', 'Cottages in Goa', '+113 more'
  ],
  'Luxury Villas': [
    'Luxury Villas in Goa', 'Luxury Villas in Karjat', 'Luxury Villas in Pune', 'Luxury Villas in Panvel',
    'Luxury Villas in Khandala', 'Luxury Villas in Dahanu', 'Luxury Villas in Sakleshpur', 'Luxury Villas in Bandipur',
    'Luxury Villas in Nandi Hills', 'Luxury Villas in Malpe', 'Luxury Villas in South Goa', 'Luxury Villas in Lonavala',
    'Luxury Villas in Mumbai', 'Luxury Villas in Matheran', '+95 more'
  ],
  'Pool Villas': [
    'Pool Villas in Goa', 'Pool Villas in Karjat', 'Pool Villas in Pune', 'Pool Villas in Panvel',
    'Pool Villas in Khandala', 'Pool Villas in Dahanu', 'Pool Villas in Sakleshpur', 'Pool Villas in Bandipur',
    'Pool Villas in Nandi Hills', 'Pool Villas in Malpe', 'Pool Villas in South Goa', 'Pool Villas in Lonavala',
    'Pool Villas in Mumbai', 'Pool Villas in Matheran', '+88 more'
  ],
  Bungalows: [
    'Bungalows in Goa', 'Bungalows in Karjat', 'Bungalows in Pune', 'Bungalows in Panvel',
    'Bungalows in Khandala', 'Bungalows in Dahanu', 'Bungalows in Sakleshpur', 'Bungalows in Bandipur',
    'Bungalows in Nandi Hills', 'Bungalows in Malpe', 'Bungalows in South Goa', 'Bungalows in Lonavala',
    'Bungalows in Mumbai', 'Bungalows in Matheran', '+77 more'
  ],
  'Places To Visit': [
    'Goa', 'Karjat', 'Pune', 'Panvel', 'Khandala', 'Dahanu', 'Sakleshpur', 'Bandipur',
    'Nandi Hills', 'Malpe', 'South Goa', 'Lonavala', 'Mumbai', 'Matheran', '+66 more'
  ],
};

export default function Footer() {
  const [activeTab, setActiveTab] = useState('Villas');

  return (
    <section className={`${prompt.className} bg-zinc-800 text-white`}>
      <div className="flex flex-col py-8 justify-center items-center">
        {/* Heading */}
        <h1 className="p-4 text-2xl font-semibold text-center">
          Popular Destinations to Rent a Holiday Home in India
        </h1>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center border-b border-gray-400 gap-8 w-full px-5">
          {Object.keys(tabData).map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 text-base md:text-lg rounded-t-lg ${
                activeTab === tab
                  ? 'bg-zinc-700 text-white font-semibold'
                  : null
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-18 mt-6 px-16 justify-center">
          {tabData[activeTab].map((item, index) => (
            <div key={index} className="text-gray-300 hover:text-white">
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Footer Section */}
      <div className="border-t border-gray-500 mt-8 py-8 px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-screen-lg mx-auto">
        {/* Top Locations */}
        <div>
          <h3 className="font-semibold mb-2">Top Locations</h3>
          <ul className="text-gray-400">
            <li>Lonavala</li>
            <li>Goa</li>
            <li>Alibaug</li>
            <li>Karjat</li>
            <li>Igatpuri</li>
            <li>Mahabaleshwar</li>
            <li>Mumbai</li>
            <li>Kasuali</li>
            <li>Mussoorie</li>
            <li>Ooty</li>
          </ul>
        </div>

        {/* Top Collections */}
        <div>
          <h3 className="font-semibold mb-2">Top Collections</h3>
          <ul className="text-gray-400">
            <li>Luxury Villas</li>
            <li>Trending This Season</li>
            <li>Pet-Friendly Villas</li>
            <li>Impeccable View Villas</li>
            <li>Corporate Offsite Villas</li>
            <li>Kid-Friendly Villas</li>
            <li>Getaway Collections</li>
          </ul>
        </div>

        {/* About */}
        <div>
          <h3 className="font-semibold mb-2">About</h3>
          <ul className="text-gray-400">
            <li>Our Story</li>
            <li>Partner With Us</li>
            <li>Offers</li>
            <li>Corporate Offsites</li>
            <li>Events & Experiences</li>
          </ul>
        </div>

        {/* Travel Guide */}
        <div>
          <h3 className="font-semibold mb-2">Travel Guide</h3>
          <ul className="text-gray-400">
            <li>Maharashtra</li>
            <li>Himachal Pradesh</li>
            <li>Uttarakhand</li>
            <li>Tamil Nadu</li>
            <li>Karnataka</li>
            <li>Kerala</li>
            <li>Punjab</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
