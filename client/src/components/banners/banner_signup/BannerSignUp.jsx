import React from "react";
import "./BannerSignUp.scss";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../../stores/authStore";

export default function BannerSignUp() {
  const { currentUser, logout } = useAuthStore();
  const navigate = useNavigate();

  const banner = {
    text: `Хочете зберегти свої улюблені рецепти та швидко їх знаходити? \n Увійдіть або зареєструйтесь та використовуйте більше функціоналу.`,
    texts: `Хочете зберегти свої улюблені рецепти та швидко їх знаходити? \n Перейдіть до улюбленого рецепту та натисніть "Зберегти"`,
  };

  return (
    <div className="banner_sign_up_container">
      <span className="montserrat-alternates-medium attention_title header1">
        Зберігайте улюблені рецепти
      </span>
      {currentUser ? (
        <span className="text">{banner.texts}</span>
      ) : (
        <>
          <span className="text">{banner.text}</span>
          <button
            type="button"
            className="button_find"
            onClick={() => navigate("/signin")}
          >
            Перейти
          </button>
        </>
      )}
    </div>
  );
}
