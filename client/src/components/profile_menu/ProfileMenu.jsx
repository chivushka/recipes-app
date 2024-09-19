import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import "./ProfileMenu.scss"
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../../stores/authStore.jsx';

export default function ProfileMenu() {

  const { currentUser, logout } = useAuthStore();
  const navigate = useNavigate()

  const [err, setErr] = useState(null);
  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      setErr(err.response.data);
    }
  };

  const menuItems = [
    {
      id: 1,
      ref: `/about_me`,
      text: 'Про мене',

    },
    {
      id: 2,
      ref: `/my_recipes`,
      text: 'Мої рецепти',
    },
    {
      id: 3,
      ref: `/saved_recipes`,
      text: 'Збережені рецепти',
    },
    {
      id: 4,
      ref: `/settings`,
      text: 'Налаштування',
      icon: ManageAccountsOutlinedIcon
    },

  ];
  const location = useLocation().pathname.split("/")[2];

  useLayoutEffect(() => {
    chooseItem(true)

  }, [location])

  const findId = (ref) => {
    let id;

    menuItems.forEach(function (item) {
      if (item.ref === ref) {
        id = item.id;
      }
    })
    return id;
  }

  const chooseItem = (e) => {
    let itemId;
    let ref;
    if (e === true) {
      itemId = findId("/" + location)
    } else {
      itemId = e.target.id;
      ref = `/profile` + menuItems[+e.target.id - 1].ref;
      navigate(ref)
    }

    highlightElement(itemId.toString())
  }

  const highlightElement = (id) => {
    const otherElements = document.getElementsByClassName("menu_item");
    for (const elem of otherElements) {
      if (elem.id === id) {
        elem.style.color = "#106B4A"
        elem.style.borderLeft = "2px solid #106B4A"

      } else {
        elem.style.color = "black"
        elem.style.background = "white"
        elem.style.border = "none"

      }
    }
  }


  return (
    <div className='profile_menu_container inter-regular'>
      <div className='user_item item_padding inter-medium'>{currentUser.name}</div>
      {menuItems.map((item) =>
        <div className='menu_item item_padding hover_menu_item' id={item.id} key={item.id} onClick={chooseItem}>
          {item.icon && <item.icon />}
          {item.text}
        </div>)}
        <div className='menu_item item_padding hover_logout_item' onClick={handleLogout}>Вихід</div>
    </div>
  )
}