import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import "./AdminMenu.scss";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/authStore.jsx";

export default function AdminMenu() {
  const { currentUser, logout } = useAuthStore();
  const navigate = useNavigate();

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
      ref: `/admin/`,
      text: "Головна",
    },
    {
      id: 2,
      ref: `/admin/users`,
      text: "Користувачі",
    },
    {
      id: 3,
      ref: `/admin/cuisines`,
      text: "Кухні світу",
    },
    {
      id: 4,
      ref: `/admin/recipes`,
      text: "Рецепти",
    },
    {
      id: 5,
      ref: `/admin/reviews`,
      text: "Відгуки",
    },
    {
      id: 6,
      ref: `/`,
      text: "Yumbook",
    },
  ];

  return (
    <div className="admin_menu_container inter-regular">
      <div className="top">
        <div className="menu_item inter-medium">Панель адміністратора</div>
        <div className="menu_item inter-medium">
          Привіт, {currentUser.name}!
        </div>
      </div>
      <div className="bottom">
        {menuItems.map((item) => (
          <Link
            style={{
              textDecoration: "none",
              color: "inherit",
            }}
            to={item.ref}
            key={item.id}
          >
            <div className="menu_item hover_menu_item" id={item.id}>
              {item.icon && <item.icon />}
              {item.text}
            </div>
          </Link>
        ))}
        <div className="menu_item hover_logout_item" onClick={handleLogout}>
          Вихід
        </div>
      </div>
    </div>
  );
}
