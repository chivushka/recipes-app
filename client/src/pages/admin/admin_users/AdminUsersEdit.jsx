import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FormInput from "../../../components/form/input_form/FormInput";
import FormSelect from "../../../components/form/form_select/FormSelect";
import { makeRequest } from "../../../axi";
import "./AdminUsersEdit.scss";
import useAuthStore from "../../../stores/authStore";

export default function AdminUsersEdit() {
  const { currentUser, logout, setCurrentUser } = useAuthStore();

  const [user, setUser] = useState({});
  const params = useParams();
  const navigate = useNavigate();

  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");

  const [oldTexts, setOldTexts] = useState({
    username: "",
    email: "",
    name: "",
    isAdmin: "",
    level: "",
    about: "",
  });
  const [texts, setTexts] = useState({
    username: "",
    email: "",
    name: "",
    isAdmin: "",
    level: "",
    about: "",
  });

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, []);

  useEffect(() => {
    fetchUserById();
  }, []);

  const handleChange = (e) => {
    setTexts((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    console.log(texts);
    if (!areObjectsEqual()) {
      const updatedUser = await updateUser(params.userId, {
        ...texts,
        userId: params.userId,
        type: "admin",
      });
      console.log("Updated user:", updatedUser);
      if (updatedUser) {
        if (params.userId === currentUser.id) {
          setCurrentUser(updatedUser);
        }
        // navigate("/admin/users");
        setSuccess("Користувача успішно оновлено");
      }
    }
  };
  const fetchUserById = async () => {
    try {
      const response = await makeRequest.get(`/users/one/${params.userId}`);
      setUser(response.data);
      const userData = response.data;
      setTexts({
        username: userData.username,
        email: userData.email,
        name: userData.name,
        isAdmin: userData.isAdmin,
        level: userData.level,
        about: userData.about,
      });
      setOldTexts({
        username: userData.username,
        email: userData.email,
        name: userData.name,
        isAdmin: userData.isAdmin,
        level: userData.level,
        about: userData.about,
      });
    } catch (error) {
      console.log(error);
      console.log(error.response.status);
      if (error.response.status === 500) {
        setErr("Користувача не існує");
        setUser({});
      }
    }
  };

  const areObjectsEqual = () => {
    const oldTextsString = JSON.stringify(oldTexts);
    const textsString = JSON.stringify(texts);
    return oldTextsString === textsString;
  };
  const updateUser = async (userId, updates) => {
    try {
      const response = await makeRequest.patch(`/users/${userId}`, updates, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          setErr("Такий логін вже існує");
        }
      } else {
        setErr("Network error");
        console.log(error);
      }
    }
  };

  const formElements = [
    {
      id: 1,
      name: "username",
      type: "text",
      defaultValue: user && user.username,
      placeholder: user && user.username,
      label: "Логін",
      errorMessage:
        "Логін має бути від 3 до 30 символів, англійською та без спеціальних символів",
      pattern: "^[A-Za-z0-9]{3,30}$",
      required: true,
    },
    {
      id: 2,
      name: "email",
      type: "email",
      defaultValue: user && user.email,
      placeholder: user && user.email,
      label: "E-mail",
      errorMessage: "Це повинна бути дійсна електронна адреса!",
      required: true,
    },
    {
      id: 3,
      name: "name",
      type: "text",
      defaultValue: user && user.name,
      placeholder: user && user.name,
      label: "Ім'я",
      errorMessage:
        "Ім'я має містити від 3 до 60 символів та не включати цифр або спеціальних символів.",
      pattern: "^[A-Za-zА-Яа-я0-9іІїЇЄє]{3,60}$",
      required: true,
    },
    {
      id: 4,
      name: "isAdmin",
      value: texts.isAdmin.toString(),
      label: "Роль користувача",
      required: true,
      opts: [
        {
          id: 1,
          name: "0",
          value: "Користувач",
        },
        {
          id: 2,
          name: "1",
          value: "Адміністратор",
        },
      ],
    },
    {
      id: 5,
      name: "level",
      value: texts.level.toString(),
      label: "Рівень кулінарії",
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
      id: 6,
      name: "about",
      type: "text",
      defaultValue: user && user.about,
      placeholder: user && user.about,
      label: "Про користувача",
      errorMessage:
        "Про користувача має містити від 3 до 200 символів та не включати цифр або спеціальних символів.",
      pattern: ".{3,200}$",
    },
  ];

  return (
    <div className="useredit_page inter-regular">
      <div className="montserrat-alternates-medium header2 header">
        Редагування користувача
      </div>
      <form onSubmit={handleUpdate}>
        {err && <span style={{ color: "#e70000" }}>{err}</span>}
        {success && <span style={{ color: "#106b4a" }}>{success}</span>}
        {user &&
          texts &&
          formElements.map((elem) =>
            elem.name === "level" || elem.name === "isAdmin" ? (
              <FormSelect
                style={{ width: "100%" }}
                key={elem.id}
                {...elem}
                value={
                  elem.name == "level"
                    ? texts.level.toString()
                    : texts.isAdmin.toString()
                }
                onChange={handleChange}
              />
            ) : (
              <FormInput
                style={{ width: "100%" }}
                key={elem.id}
                {...elem}
                defaultValue={elem.defaultValue}
                onChange={handleChange}
              />
            )
          )}
        <button>Оновити</button>
      </form>
    </div>
  );
}
