import React from 'react'
import { Link } from 'react-router-dom'
import HotelCard from './HotelCard'

function Hotels({trip}) {
  
  return (
    <div>
    <h2 className='font-bold text-xl mt-5'>Hotels Recommendations</h2> 
    <div className='flex flex-wrap justify-center gap-6 mt-6'>
        {trip?.tripData?.hotels?.map((hotel,index)=>(
            <HotelCard hotel={hotel}/>
            
        ))}
    </div>

    </div>
  )
}

export default Hotels