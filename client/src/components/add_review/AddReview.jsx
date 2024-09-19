import React, { useEffect, useState } from "react";
import "./AddReview.scss";
import useAuthStore from "../../stores/authStore";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import StarIcon from "@mui/icons-material/Star";
import { useNavigate, useParams } from "react-router-dom";
import { makeRequest } from "../../axi";

export default function AddReview({ setRefetchR, recipeId }) {
  const starsArr = [1, 2, 3, 4, 5];

  const { currentUser } = useAuthStore();

  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [rate, setRate] = useState(0);
  const [rateWidth, setRateWidth] = useState("");

  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    const width = (100 * +rate) / 5;
    setRateWidth(width.toString() + "%");
  }, [rate]);

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };
  const [err, setErr] = useState(""); // Додайте стейт для зберігання помилок

  const handleClick = async (e) => {
    e.preventDefault();
    if (!currentUser) return navigate("/signin"); // Перевіряємо, чи є поточний користувач, якщо ні, перенаправляємо його на сторінку входу

    if (!text.trim()) return setErr("Будь ласка, введіть текст відгуку"); // Перевіряємо, чи не порожній текст

    if (rate === 0) return setErr("Будь ласка, вкажіть рейтинг"); // Перевіряємо, чи встановлений рейтинг

    let imgUrl = "";
    if (file) imgUrl = await upload(); // Якщо є файл, виконуємо завантаження

    try {
      await addReview(params.recipeId, rate, text, imgUrl || null); // Додаємо відгук
      setText("");
      setFile(null);
      setRateWidth("0%");
      setRefetchR((prevState) => !prevState);
    } catch (error) {
      console.error("Failed to add review:", error);
    }
  };

  const addReview = async (recipeId, rate, text, imgUrl) => {
    try {
      const response = await makeRequest.post(
        `/reviews/add?userId=${currentUser.id}`,
        {
          recipeId: recipeId,
          rating: rate,
          text: text,
          img: imgUrl, // Якщо imgUrl існує, передаємо його, інакше передаємо null
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to add review:", error);
      throw error;
    }
  };

  return (
    <div className="addreview_container">
      <div className="inside">
        <div className="rate">
          {/* Дайте оцінку рецепту від 1 до 5 */}
          <div className="stars">
            <div className="stars__nofill">
              {starsArr.map((star, index) => (
                <StarIcon
                  className="icon"
                  key={index}
                  style={{ color: "#FFCDCD", fontSize: "22px" }}
                  onClick={(e) => {
                    e.stopPropagation;
                    setRate(index + 1);
                  }}
                />
              ))}
              <div className="stars__filled" style={{ width: rateWidth }}>
                {starsArr.map((star, index) => (
                  <StarIcon
                    className="icon"
                    key={index}
                    style={{ color: "#E70000", fontSize: "22px" }}
                    onClick={(e) => {
                      e.stopPropagation;
                      setRate(index + 1);
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="top">
          <div className="left">
            <textarea
              cols="65"
              rows="4"
              minLength={3}
              maxLength={500}
              placeholder={`Чи готували ви цей рецепт? Поділіться власним враженням.`}
              onChange={(e) => setText(e.target.value)}
              value={text}
            />
          </div>

          <div className="right">
            {file && (
              <img className="file" alt="" src={URL.createObjectURL(file)} />
            )}
          </div>
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <input
              type="file"
              id="file"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
            />
            <label htmlFor="file">
              <div className="item">
                <AddPhotoAlternateIcon className="icon" />
                <span>Додати фото</span>
              </div>
            </label>
          </div>
          <div className="right">
            <button onClick={handleClick}>Надіслати</button>
          </div>
        </div>
        {err && <div className="error">{err}</div>}
      </div>
    </div>
  );
}
