import React from 'react'
import RecipeCard from '../recipe_card/RecipeCard'
import './RecipesList.scss'

export default function RecipesList({recipes,type, refetch, setRefetch}) {
    return (
        <div className='recipes_list'>
            {recipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} type={type} refetch={refetch} setRefetch={setRefetch}/>
            ))}
            
        </div>
    )


}
