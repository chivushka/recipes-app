import React, { useContext, useEffect, useState } from "react";
import "./Navbar.scss";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/authStore";

export default function Navbar() {
  const { currentUser, logout, isAdmin } = useAuthStore();

  const [showMenu, setShowMenu] = useState(false);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.log(err.response.data);
    }
  };
  return (
    <div className="navbar_container">
      <div className="container">
        <div className="menu_burger_icon">
          <MenuOutlinedIcon
            onClick={() => setShowMenu(!showMenu)}
            style={{ position: "relative" }}
          />
          {showMenu && (
            <div className="mobile_menu">
              <div className="menu_list">
                <Link
                  className="link_elem"
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    width: "100%",
                  }}
                  to={`/`}
                >
                  <div className="profile_list_elem" onClick={() => setShowMenu(!showMenu)}>Головна</div>
                </Link>
                <Link
                  className="link_elem"
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    width: "100%",
                  }}
                  to={`/recipes`}
                >
                  <div className="profile_list_elem" onClick={() => setShowMenu(!showMenu)}>Рецепти</div>
                </Link>
                <Link
                  className="link_elem"
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    width: "100%",
                  }}
                  to={`/cuisines`}
                >
                  <div className="profile_list_elem" onClick={() => setShowMenu(!showMenu)}>Кухні світу</div>
                </Link>
                <Link
                  className="link_elem"
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    width: "100%",
                  }}
                  to={`/about`}
                >
                  <div className="profile_list_elem" onClick={() => setShowMenu(!showMenu)}>Про нас</div>
                </Link>
                {currentUser !== null ? (
                  <>
                    <Link
                      className="link_elem"
                      style={{
                        textDecoration: "none",
                        color: "inherit",
                        width: "100%",
                      }}
                      to={`/profile/about_me`}
                    >
                      <div className="profile_list_elem" onClick={() => setShowMenu(!showMenu)}>Мій кабінет</div>
                    </Link>
                    <div
                      className="profile_list_elem hover_red"
                      onClick={handleLogout}
                    >
                      Вихід
                    </div>
                  </>
                ) : (
                  <Link
                    className="link_elem"
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      width: "100%",
                    }}
                    to={`/signin`}
                  >
                    <div className="profile_list_elem" style={{color:"#106b4a"}}>Вхід</div>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="left">
          <Link style={{ textDecoration: "none", color: "inherit" }} to={`/`}>
            <div className="appname">
              <span className="pacifico-regular">YumBook</span>
            </div>
          </Link>
          <div className="menu inter-regular">
            <Link style={{ textDecoration: "none", color: "inherit" }} to={`/`}>
              <div className="menu__elem">Головна</div>
            </Link>
            <Link
              style={{ textDecoration: "none", color: "inherit" }}
              to={`/recipes`}
            >
              <div className="menu__elem">Рецепти</div>
            </Link>
            <Link
              style={{ textDecoration: "none", color: "inherit" }}
              to={`/cuisines`}
            >
              <div className="menu__elem">Кухні світу</div>
            </Link>
            <Link
              style={{ textDecoration: "none", color: "inherit" }}
              to={`/about`}
            >
              <div className="menu__elem">Про нас</div>
            </Link>
          </div>
        </div>
        <div className="right_side">
          <Link
            style={{ textDecoration: "none", color: "inherit" }}
            to={`/search`}
          >
            <div className="item">
              <SearchIcon className="icon" />
            </div>
          </Link>
          {currentUser !== null ? (
            <div className="item_signin signin_hide">
              <Link
                style={{ textDecoration: "none", color: "inherit" }}
                to={`/profile/about_me`}
              >
                <div className="item">
                  <AccountCircleOutlinedIcon className="icon" />
                  <span className="text">Мій кабінет</span>
                </div>
              </Link>
              <div className="profile_list">
                <Link
                  className="link_elem"
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    width: "100%",
                  }}
                  to={`/profile/about_me`}
                >
                  <div className="profile_list_elem">Про мене</div>
                </Link>
                <Link
                  className="link_elem"
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    width: "100%",
                  }}
                  to={`/profile/my_recipes`}
                >
                  <div className="profile_list_elem">Мої рецепти</div>
                </Link>
                <Link
                  className="link_elem"
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    width: "100%",
                    borderBottom: "1px solid #106B4A",
                  }}
                  to={`/profile/saved_recipes`}
                >
                  <div className="profile_list_elem">Збережені</div>
                </Link>
                { isAdmin &&<Link
                  className="link_elem"
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    width: "100%",
                  }}
                  to={`/admin/`}
                >
                  <div className="profile_list_elem">Панель адміністратора</div>
                </Link>}
                <Link
                  className="link_elem"
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    width: "100%",
                  }}
                  to={`/profile/add_recipe`}
                >
                  <div className="profile_list_elem">Додати рецепт</div>
                </Link>
                <div
                  className="profile_list_elem hover_red"
                  onClick={handleLogout}
                >
                  Вихід
                </div>
              </div>
            </div>
          ) : (
            <div className="item signin_hide">
              <Link
                style={{ textDecoration: "none", color: "inherit" }}
                to={`/signin`}
              >
                <div className="item">
                  <AccountCircleOutlinedIcon className="icon" />
                  <span className="inter-medium text">Вхід</span>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
