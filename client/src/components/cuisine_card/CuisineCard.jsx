import React, { useEffect, useState } from 'react'
import StarIcon from '@mui/icons-material/Star';
import "./CuisineCard.scss"
import { Link } from 'react-router-dom';

export default function CuisineCard({ cuisine }) {

    return (
        <div className='cuisine_card'>
            <Link style={{ textDecoration: "none", color: "inherit", width: '100%' }}
                to={'/cuisines/' + cuisine.id}>
                <div className='inside'>
                <span className='cuisine_name'>{cuisine.name}</span>
                </div>
            </Link>
        </div>

    )
}