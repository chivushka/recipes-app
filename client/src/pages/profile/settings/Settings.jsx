import React, { useContext, useEffect, useState } from "react";
import "./Settings.scss";
import { makeRequest } from "../../../axi.js";
import useAuthStore from "../../../stores/authStore.jsx";
import FormInput from "../../../components/form/input_form/FormInput.jsx";
import { useNavigate } from "react-router-dom";
import FormSelect from "../../../components/form/form_select/FormSelect.jsx";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

export default function Settings() {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useAuthStore();

  const [err, setErr] = useState(null);
  const [file, setFile] = useState(null);

  const [oldTexts, setOldTexts] = useState({
    name: "",
    level: "",
    username: "",
    email: "",
    about: "",
    profilePic: "",
  });
  const [texts, setTexts] = useState({
    name: "",
    level: "",
    username: "",
    email: "",
    about: "",
    profilePic: "",
  });

  const handleChange = (e) => {
    setTexts((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
      setErr("Помилка завантаження зображення");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    let imgUrl = currentUser.profilePic; // Використовуємо поточний URL зображення, якщо файл не вибраний
    if (file) {
      imgUrl = await upload();
    }

    // Оновлюємо стан texts з новим URL зображення
    const updatedTexts = {
      ...texts,
      profilePic: imgUrl,
    };
    console.log(texts);

    if (!areObjectsEqual(oldTexts, updatedTexts)) {
      try {
        const updatedUser = await updateUser(currentUser.id, {
          ...updatedTexts,
          userId: currentUser.id,
        });
        console.log("Updated user:", updatedUser);
        if (updatedUser) {
          setCurrentUser(updatedUser);
          navigate("/profile/about_me");
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    const userData = currentUser;
    setTexts({
      name: userData.name,
      level: userData.level,
      username: userData.username,
      email: userData.email,
      about: userData.about,
      profilePic: userData.profilePic,
    });
    setOldTexts({
      name: userData.name,
      level: userData.level,
      username: userData.username,
      email: userData.email,
      about: userData.about,
      profilePic: userData.profilePic,
    });
  }, []);

  const areObjectsEqual = (obj1, obj2) => {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  };

  const updateUser = async (userId, updates) => {
    try {
      const response = await makeRequest.patch(`/users/${userId}`, updates);
      return response.data;
    } catch (error) {
      if (error.response) {
        if (error.response.about === 400) {
          setErr("Такий логін вже існує");
        }
      } else {
        setErr("Network error");
      }
    }
  };

  const formElements = [
    {
      id: 1,
      name: "name",
      type: "text",
      value: texts.name.toString(),
      placeholder: currentUser.name,
      label: "Ім'я",
      errorMessage:
        "Ім'я має містити від 3 до 60 символів та не включати цифр або спеціальних символів.",
      pattern: "^[A-Za-zА-Яа-я0-9іІїЇЄє]{3,60}$",
      required: true,
    },
    {
      id: 2,
      name: "level",
      value: texts.level.toString(),
      placeholder: currentUser.level,
      label: "Оберіть ваш рівень кулінарії",
      required: true,
      opts: [
        {
          id: 1,
          name: "Amateur",
          value: "Аматор",
        },
        {
          id: 2,
          name: "Home Cook",
          value: "Любитель",
        },
        {
          id: 3,
          name: "Expert",
          value: "Експерт",
        },
      ],
    },
    {
      id: 3,
      name: "username",
      type: "text",
      value: texts.username.toString(),
      placeholder: currentUser.username,
      label: "Логін",
      errorMessage:
        "Логін має бути від 3 до 30 символів, англійською та без спеціальних символів",
      pattern: "^[A-Za-z0-9]{3,30}$",
      required: true,
    },
    {
      id: 4,
      name: "email",
      type: "email",
      value: texts.email.toString(),
      placeholder: currentUser.email,
      label: "E-mail",
      errorMessage: "Це повинна бути дійсна електронна адреса!",
      required: true,
    },
    {
      id: 6,
      name: "about",
      type: "text",
      defaultValue: currentUser.about,
      placeholder: currentUser.about,
      label: "Про мене (відобразиться у профілі)",
      errorMessage:
        "Про користувача має містити від 3 до 200 символів та не включати цифр або спеціальних символів.",
      pattern: ".{3,200}$",
      required: true,
    },
  ];

  return (
    <div className="settings_page">
      <div className="container">
        <span className="montserrat-alternates-bold header2 ">
          Налаштування облікового запису
        </span>
        <span>Тут ви можете змінити особисту інформацію.</span>
      </div>
      <div className="line" />
      <div className="container">
        <span className="montserrat-alternates-bold header3 ">
          Оновлення інформації
        </span>

        <form onSubmit={handleUpdate}>
          {currentUser &&
            formElements.map((elem) =>
              elem.name === "level" ? (
                <FormSelect
                  style={{ width: "50%" }}
                  key={elem.id}
                  {...elem}
                  value={elem.value}
                  onChange={handleChange}
                />
              ) : (
                <FormInput
                  style={{ width: "50%" }}
                  key={elem.id}
                  {...elem}
                  value={elem.value}
                  onChange={handleChange}
                />
              )
            )}
          {(file && currentUser.profilePic !== null) && (
            <img
              className="file"
              alt=""
              src={
                file
                  ? URL.createObjectURL(file)
                  : `/upload/${currentUser.profilePic}`
              }
            />
          )}
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={(e) => {
              setFile(e.target.files[0]);
            }}
          />
          <label htmlFor="file">
            <div
              className="item"
              style={{ display: "flex", alignItems: "center" }}
            >
              <AddPhotoAlternateIcon className="icon" />
              <span>Додати фото</span>
            </div>
          </label>
          <button>Оновити</button>

          {err && <span style={{ color: "red" }}>{err}</span>}
        </form>
      </div>
    </div>
  );
}
