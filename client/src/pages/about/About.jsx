import React, { useEffect } from 'react'
import "./About.scss"

export default function About() {
  const sections = [
    {
      id: 1,
      title: "Що символізує YumBook?",
      text: `YumBook - це веб-сайт, який представляє собою книгу рецептів. Тут ви зможете знайти нову страву для приготування у будь-який момент дня. Якщо вам сподобався рецепт, ви зможете легко додати його до обраного.`,
      img: "about1.webp",
      color: "#106B4A"
    },
    {
      id: 2,
      title: "Хто ми?",
      text: `Ми - команда домашніх кулінарів та розробників. Кожен з нас готує щодня. Але іноді з'являється бажання спробувати щось нове, як наприклад страви з інших країн або навіть континентів. 
      Саме тому, ми вирішили створити веб-сайт, повний смачних страв від домашніх кулінарів та навіть експертів у даній непростій справі - приготуванні смачної їжі. Ми хотіли поділитися нашим досвідом та надати вам можливість розмістити рецепти з різних куточків світу.`,
      img: "about2.webp",
      color: "#106B4A"
    },
    {
      id: 3,
      title: "Поділіться власними рецептами зі спільнотою YumBook!",
      text: `Далі наведено інформацію про те, як поділитися власними рецептами. Щоб додати рецепт, увійдіть у свій обліковий запис та перейдіть у профіль. Натисніть на "Мої рецепти". Там ви знайдете кнопку "Додати рецепт". Перш ніж відправити його на затвердження,  ретельно перегляньте свій рецепт. Якщо ваша страва не підійде для YumBook, ми її не приймемо, статус відобразиться на рецепті. Будьте творчими та діліться своїми найкращими кулінарними шедеврами зі спільнотою YumBook!`,
      img: "about3.webp",
      color: "#f55e5e"
    },

  ]

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 })
  }, [])

  return (
    <div className='about_page'>
      <div className='page_header'>
        <span className='montserrat-alternates-medium header1'>Про нас</span>
        <div className='line' />
      </div>
      <div className='sections_list '>
        {sections.map((element, index) => (
          <div key={index} section={element} className='section_elem'>
            <div className='img_wrapper'>
              <img src={'/images/' + element.img} alt='' />
            </div>
            <div className='header2 montserrat-alternates-medium' style={{ color: element.color }}>{element.title}</div>
            <div className='text'>{element.text}</div>
          </div>
        ))}

      </div>
    </div>
  )
}
