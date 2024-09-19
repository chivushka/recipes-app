import React from "react";

export default function AdminMain() {
  return (
    <div className="admin_page inter-regular">
      <div
        className="montserrat-alternates-medium header1"
        style={{ color: "#106B4A" }}
      >
        Панель адміністратора
      </div>
      <div className="options">
        <div
          className="montserrat-alternates-medium header2"
          style={{ color: "black" }}
        >
          Користувачі
        </div>
        <div
          className="montserrat-alternates-medium header2"
          style={{ color: "black" }}
        >
          Кухні світу
        </div>
        <div
          className="montserrat-alternates-medium header2"
          style={{ color: "black" }}
        >
          Рецепти
        </div>
        <div
          className="montserrat-alternates-medium header2"
          style={{ color: "black" }}
        >
          Відгуки
        </div>
      </div>
    </div>
  );
}
