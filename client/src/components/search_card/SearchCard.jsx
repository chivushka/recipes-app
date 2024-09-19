import React from 'react'
import "./SearchCard.scss"
import { Link } from 'react-router-dom';

export default function SearchCard({ element}) {
    return (

        <div className='search_card'>

            <Link style={{ textDecoration: "none", color: "inherit", width: '100%' }} to={(element.stype=='recipe' ? `/recipes/`:`/news/`) + element.id}>
                
                <div className='img_wrapper'>
                    <img src={'/upload/' +element.img } alt='' />
                </div>

                <div className='content'>
                    <div className='search_name inter-medium left'>{element.title}</div>
                    <div className='right'></div>
                </div>

            </Link>

        </div>

    )
}