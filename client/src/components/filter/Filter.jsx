import React, { useEffect, useState } from "react";
import {
  useSearchParams,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import "./Filter.scss";
import { Select } from "antd";
import { makeRequest } from "../../axi";
import useAuthStore from "../../stores/authStore";

export default function Filter({ handleFilterChange }) {
  const { currentUser } = useAuthStore();
  const [searchParams] = useSearchParams();
  const [cuisines, setCuisines] = useState([]);
  const [categories, setCategories] = useState([]);

  const params = useParams();

  useEffect(() => {
    fetchCuisines();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const value = "name asc";
    try {
      const response = await makeRequest.get("/categories/getall", {
        params: { sort: value },
      });
      setCategories(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCuisines = async () => {
    const value = "name asc";
    try {
      const response = await makeRequest.get("/cuisines/getall", {
        params: { sort: value },
      });
      setCuisines(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="filter_container">
      <div className="left">
        <div className="inside">
          <select
            name="category"
            id=""
            className=""
            onChange={handleFilterChange}
            value={searchParams.get("category") || ""}
          >
            <option value="">Категорія</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <select
            name="cuisine"
            id=""
            className=""
            onChange={handleFilterChange}
            value={searchParams.get("cuisine") || ""}
          >
            <option value="">Кухня світу</option>
            {cuisines.map((cuisine) => (
              <option key={cuisine.id} value={cuisine.id}>
                {cuisine.name}
              </option>
            ))}
          </select>
          <select
            name="difficulty"
            id=""
            className=""
            onChange={handleFilterChange}
            defaultValue={searchParams.get("difficulty") || ""}
          >
            <option value="">Складність</option>
            <option value="Easy">Легко</option>
            <option value="Medium">Помірно</option>
            <option value="Hard">Складно</option>
          </select>
          <select
            name="level"
            id=""
            className=""
            onChange={handleFilterChange}
            defaultValue={searchParams.get("level") || ""}
          >
            <option value="">Рівень автора</option>
            <option value="Amateur">Аматор</option>
            <option value="Home Cook">Любитель</option>
            <option value="Expert">Експерт</option>
          </select>
          <select
            name="time"
            id=""
            className=""
            onChange={handleFilterChange}
            defaultValue={searchParams.get("time") || ""}
          >
            <option value="">Приготування</option>
            <option value="0 30">До 30 хвилин</option>
            <option value="30 60">30-60 хвилин</option>
            <option value="60 120">1-2 години</option>
            <option value="120 ">Більше 2 годин</option>
          </select>
        </div>
      </div>

      <div className="right">
        <div className="inside">
          <select
            name="sort"
            id=""
            onChange={handleFilterChange}
            defaultValue={searchParams.get("sort") || ""}
          >
            <option value="">Сортування</option>
            <option value="currentRating desc">Від 5☆ до 1☆</option>
            <option value="updatedAt desc">Останні</option>
            <option value="updatedAt asc">Найдавніші</option>
          </select>

          {/* {currentUser && <button>Пошук за інгредієнтами</button>} */}
        </div>
      </div>
    </div>
  );
}
