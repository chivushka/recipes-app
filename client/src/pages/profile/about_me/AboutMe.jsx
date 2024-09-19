import React, { useContext, useEffect, useState } from "react";
import "./AboutMe.scss";
import useAuthStore from "../../../stores/authStore.jsx";
import { Link } from "react-router-dom";
import { transformUserLevel } from "../../../utils/userUtils.jsx";

export default function AboutMe() {
  const { currentUser, isAdmin } = useAuthStore();

  return (
    <div className="aboutme_page">
      <div className="container">
        <span className="montserrat-alternates-bold header2 ">
          Персональна інформація
        </span>
        <span>Вся інформація про вас.</span>
      </div>
      <div className="line" />
      <table>
        <tbody>
          <tr>
            <td>Ім'я</td>
            <td className="user_info">{currentUser.name}</td>
          </tr>
          <tr>
            <td>Рівень</td>
            <td className="user_info">
              {transformUserLevel(currentUser.level)}
            </td>
          </tr>
          <tr>
            <td>Логін</td>
            <td className="user_info">{currentUser.username}</td>
          </tr>
          <tr>
            <td>E-mail</td>
            <td className="user_info">{currentUser.email}</td>
          </tr>
          {isAdmin && (
            <tr>
              <td>Адмін панель</td>
              <Link
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  width: "100%",
                }}
                to={"/admin/"}
              >
                <td className="user_info">
                  <div className="admin">Перейти на панель адміністратора</div>
                </td>
              </Link>
            </tr>
          )}
        </tbody>
      </table>
      <div className="container">
        <Link
          style={{ textDecoration: "none", color: "inherit", width: "100%" }}
          to={"/cook/" + currentUser.id}
        >
          <button className="toprofile">Перейти на публічний профіль</button>
        </Link>
      </div>
    </div>
  );
}
