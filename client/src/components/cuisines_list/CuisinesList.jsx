import React from 'react'
import './CuisinesList.scss'
import CuisineCard from '../cuisine_card/CuisineCard'

export default function CuisinesList({cuisines}) {
    return (
        <div className='cuisines_list'>
            {cuisines.map((cuisine) => (
                <CuisineCard key={cuisine.id} cuisine={cuisine} />
            ))}
            
        </div>
    )


}