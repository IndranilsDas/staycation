import React from 'react'
import { Prompt } from 'next/font/google';

const prompt = Prompt({
  subsets: ['latin'],
  weight: ['200', '300', '400', '600', '800'],
});

export default function Stats() {
  return (
    <section className={`${prompt.className} bg-white py-8 md:py-16 overflow-hidden`}>
      <div className='container mx-auto px-4'>
        <div className='flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 lg:gap-16'>
          {/* Stat Item 1 */}
          <div className='flex flex-col md:flex-row items-center gap-2 px-4 font-light text-black text-center md:text-left'>
            <img src='/images/svg/traveller.svg' alt="Award" className='w-10 h-10' />
            <span>Awarded Favourite<br />Villa Rentals</span>
          </div>
          
          {/* Divider - hidden on mobile */}
          <div className='hidden md:block border-r border-black h-12'></div>
          
          {/* Stat Item 2 */}
          <div className='flex flex-col md:flex-row items-center gap-2 px-4 text-black text-center md:text-left'>
            <img src='/images/svg/100.webp' alt="100 Homes" className='w-10 h-10' />
            <span className='font-light'>Homes<br />accepted</span>
          </div>
          
          {/* Divider - hidden on mobile */}
          <div className='hidden md:block border-r border-black h-12'></div>
          
          {/* Stat Item 3 */}
          <div className='flex flex-col md:flex-row items-center gap-2 px-4 text-black text-center md:text-left'>
            <img src='/images/svg/1000+.svg' alt="1000+ Villas" className='w-10 h-10' />
            <span className='font-light'>Handpicked<br />Villas</span>
          </div>
          
          {/* Divider - hidden on mobile */}
          <div className='hidden md:block border-r border-black h-12'></div>
          
          {/* Stat Item 4 */}
          <div className='flex flex-col md:flex-row items-center gap-2 px-4 text-black text-center md:text-left'>
            <img src='/images/svg/8l.svg' alt="8L Happy Guests" className='w-10 h-10' />
            <span className='font-light'>Happy guests<br />hosted</span>
          </div>
        </div>
      </div>
    </section>
  )
}