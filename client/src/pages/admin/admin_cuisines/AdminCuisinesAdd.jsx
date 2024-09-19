import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FormInput from "../../../components/form/input_form/FormInput";
import { makeRequest } from "../../../axi";
import useAuthStore from "../../../stores/authStore";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

export default function AdminCuisinesAdd() {
  const { currentUser, logout, setCurrentUser } = useAuthStore();

  const [cuisine, setCuisine] = useState({});
  const [file, setFile] = useState(null);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");

  const params = useParams();
  const navigate = useNavigate();

  const [texts, setTexts] = useState({
    name: "",
    text: "",
    img: "",
  });

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, []);

  useEffect(() => {
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

  const handleCreate = async (e) => {
    e.preventDefault();
    console.log(texts);
    let imgUrl = "";
    if (file) imgUrl = await upload();
    setTexts((prev) => ({ ...prev, ["img"]: imgUrl }));
    try {
      const createdCuisine = await createCuisine(texts.name, texts.text, imgUrl);
      console.log("Created cuisine:", createdCuisine);
      if (createdCuisine) {
        setSuccess("Кухня успішно створена");
        //   navigate("/admin/cuisines");
      }
    } catch (error) {
      setErr("Щось пішло не так");
    }
  };

  const createCuisine = async (name, text, imgUrl) => {
    try {
      const response = await makeRequest.post(
        `/cuisines/add?userId=${currentUser.id}`,
        {
          name: name,
          text: text,
          img: imgUrl,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to create cuisine:", error);
      throw error;
    }
  };

  const formElements = [
    {
      id: 1,
      name: "name",
      type: "text",
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
        Створення кухні світу
      </div>
      <form onSubmit={handleCreate}>
        {cuisine &&
          formElements.map((elem) => (
            <FormInput
              style={{ width: "100%" }}
              key={elem.id}
              {...elem}
              onChange={handleChange}
            />
          ))}

        {file && (
          <img className="file" alt="" src={URL.createObjectURL(file)} />
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

        <button>Додати</button>

        {err && <span style={{ color: "#e70000" }}>{err}</span>}
        {success && <span style={{ color: "#106b4a" }}>{success}</span>}
      </form>
    </div>
  );
}
