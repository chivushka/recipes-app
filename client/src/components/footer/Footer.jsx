import React from 'react'
import "./Footer.scss"

export default function Footer() {
  return (
    <div className='footer_container inter-regular'>
    <div className='appname'>
    <span className='appname pacifico-regular'>YumBook</span>
    </div>
    <div className='right_menu'>
      {/* <div className='undermenu show'>
        <span className='inter-medium undermenu_header'>Приготувати</span>
        <span className='elem'>Сніданок</span>
        <span className='elem'>Обід</span>
        <span className='elem'>Вечеря</span>
        <span className='elem'>Супи</span>
        <span className='elem'>Другі страви</span>
        <span className='elem'>Салати</span>
        <span className='elem'>Десерти</span>
      </div> */}
      <div className='undermenu'>
        <span className='inter-medium undermenu_header'>YumBook</span>
        <span className='elem'>Головна</span>
        <span className='elem'>Рецепти</span>
        <span className='elem'>Кухні світу</span>
        <span className='elem'>Про нас</span>
      </div>
      <div className='undermenu'>
        <span className='inter-medium undermenu_header'>Підпишись</span>
        <span className='elem'>Instagram</span>
        <span className='elem'>Facebook</span>
        <span className='elem'>Pinterest</span>
        <span className='elem'>Youtube</span>
      </div>
    </div>
      
      
    </div>
  )
}
