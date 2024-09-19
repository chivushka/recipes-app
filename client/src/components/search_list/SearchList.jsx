import React from 'react'
import './SearchList.scss'
import SearchCard from '../search_card/SearchCard'

export default function SearchList({ search}) {

    return (
        <div className='search_list'>
            {search.map((element, index) => (
                <SearchCard key={index} element={element} />
            ))}
        </div>
    )


}