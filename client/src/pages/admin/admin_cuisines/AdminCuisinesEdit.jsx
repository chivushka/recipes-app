import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FormInput from "../../../components/form/input_form/FormInput";
import { makeRequest } from "../../../axi";
import useAuthStore from "../../../stores/authStore";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

export default function AdminCuisinesEdit() {
  const { currentUser, logout, setCurrentUser } = useAuthStore();

  const [cuisine, setCuisine] = useState({});
  const [file, setFile] = useState(null);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");

  const params = useParams();
  const navigate = useNavigate();

  const [oldTexts, setOldTexts] = useState({
    name: "",
    text: "",
    img: "",
  });
  const [texts, setTexts] = useState({
    name: "",
    text: "",
    img: "",
  });

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, []);

  useEffect(() => {
    fetchCuisineById();
  }, []);

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
    console.log(texts);
    console.log(file);
    
    let imgUrl = texts.img; // Використовуємо поточний URL зображення, якщо файл не вибраний
    if (file) {
      imgUrl = await upload();
    }

    // Оновлюємо стан texts з новим URL зображення
    const updatedTexts = {
      ...texts,
      img: imgUrl,
    };

    // Перевіряємо зміни між поточним і оновленим станом
    if (!areObjectsEqual(oldTexts, updatedTexts)) {
      try {
        const updatedCuisine = await updateCuisine(params.cuisineId, {
          ...updatedTexts,
          userId: currentUser.id,
        });
        console.log("Updated cuisine:", updatedCuisine);
        if (updatedCuisine) {
          setOldTexts(updatedTexts);
          setFile(null);
          fetchCuisineById();
          setSuccess("Кухня успішно оновлена");
          // navigate("/admin/cuisines");
        }
      } catch (error) {
        console.error("Помилка при оновленні кухні:", error);
      }
    }
  };

  const areObjectsEqual = (obj1, obj2) => {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  };

  const fetchCuisineById = async () => {
    try {
      const response = await makeRequest.get(`/cuisines/one`, {
        params: { cuisineId: params.cuisineId },
      });
      setCuisine(response.data[0]);
      const dataResult = response.data[0];
      setTexts({
        name: dataResult.name,
        text: dataResult.text,
        img: dataResult.img,
      });
      setOldTexts({
        name: dataResult.name,
        text: dataResult.text,
        img: dataResult.img,
      });
    } catch (error) {
      console.log(error);
      console.log(error.response.status);
      if (error.response.status === 500) {
        setErr("Кухні не існує");
        setCuisine({});
      }
    }
  };

  const updateCuisine = async (cuisineId, updates) => {
    try {
      const response = await makeRequest.patch(
        `/cuisines/${cuisineId}`,
        updates
      );

      return response.data;
    } catch (error) {
      console.error("Помилка при оновленні кухні:", error);
      throw error; // Прокидуємо помилку для обробки на рівні викликувача
    }
  };

  const formElements = [
    {
      id: 1,
      name: "name",
      type: "text",
      defaultValue: cuisine && cuisine.name,
      placeholder: cuisine && cuisine.name,
      label: "Назва",
      errorMessage:
        "Назва має містити від 3 до 60 символів та не включати цифр або спеціальних символів.",
      pattern: "^[A-Za-zА-Яа-я0-9іІїЇЄє]{3,100}$",
      required: true,
    },
    {
      id: 2,
      name: "text",
      type: "text",
      defaultValue: cuisine && cuisine.text,
      placeholder: cuisine && cuisine.text,
      label: "Опис",
      errorMessage:
        "Назва має містити від 3 до 60 символів та не включати цифр або спеціальних символів.",
      pattern: ".{3,500}$",
      required: true,
    },
  ];

  return (
    <div className="admin_page inter-regular">
      <div className="montserrat-alternates-medium header2 header">
        Редагування кухні світу
      </div>
      <form onSubmit={handleUpdate}>
        {cuisine &&
          formElements.map((elem) => (
            <FormInput
              style={{ width: "100%" }}
              key={elem.id}
              {...elem}
              onChange={handleChange}
            />
          ))}

        {(file || cuisine.img !== "") && (
          <img
            className="file"
            alt=""
            src={file ? URL.createObjectURL(file) : `/upload/${cuisine.img}`}
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
          <div className="item">
            <AddPhotoAlternateIcon className="icon" />
            <span>Додати фото</span>
          </div>
        </label>

        <button>Оновити</button>

        {err && <span style={{ color: "#e70000" }}>{err}</span>}
        {success && <span style={{ color: "#106b4a" }}>{success}</span>}
      </form>
    </div>
  );
}
