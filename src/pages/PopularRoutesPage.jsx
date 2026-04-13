import React from 'react'
import NavBar from '../components/NavBar'
import PopularRoutes from '../components/PopularRoutes'

function PopularRoutesPage() {
  window.scrollTo({ top: 0, behavior: "smooth" });
  
  return (
    <div className='flex flex-row mb-20'>
      <NavBar />
      <div className="flex flex-col w-full p-6 mt-10">
        <h1 className="text-white text-4xl audiowide mt-20">View All Popular Routes</h1>
        <p className="text-[#808387] text-[14px]">
          See the most traveled paths in Nigeria
        </p>
        <div className="flex flex-col mt-10">
          <PopularRoutes />
        </div>
      </div>
    </div>
  )
}

export default PopularRoutesPage
