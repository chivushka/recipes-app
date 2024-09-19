import React from 'react'

export default function MealCard({ meal }) {
    return (
        <div className='card_meal'>
            <div className='img_wrapper'>
                <img src={'/images/' + meal.img_name + '.webp'} alt='' />
            </div>

            <span className='inter-medium'>{meal.meal_name}</span>
        </div>
    )
}
