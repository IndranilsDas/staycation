import React from 'react';

export default function Banner1() {
  return (
    <section className="bg-white overflow-x-auto overflow-y-hidden">
      {/* Ensure the inner container is fixed at 1035px */}
      <div className="mx-auto flex justify-center overflow-clip">
        <img 
          src="/images/banner.webp" 
          alt="Banner" 
          className="h-40 rounded-3xl object-cover" 
        />
      </div>
    </section>
  );
}
