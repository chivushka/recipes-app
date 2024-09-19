import React from 'react'
import './BannerFindRecipe.scss'
import { useNavigate } from 'react-router-dom';

export default function BannerFindRecipe() {
  const navigate = useNavigate();

  const banner= {
    text:`Недостатньо інгредієнтів? \n Спробуйте знайти рецепт з наявними.`
  }
  return (
    <div className='banner_find_recipe_container'>
          <span className='montserrat-alternates-medium attention_title header1'>Знайдіть улюблені рецепти</span>
          <span className='text'>
            {banner.text}
          </span>
          <button className='button_find' onClick={() => navigate("/search")}>Перейти</button>
    </div>
  )
}
