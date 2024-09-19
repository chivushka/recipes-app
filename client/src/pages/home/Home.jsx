import React, { useEffect, useState } from "react";
import "./Home.scss";
import RecipesList from "../../components/recipes_list/RecipesList.jsx";
import BannerFindRecipe from "../../components/banners/banner_findrecipe/BannerFindRecipe.jsx";
import { makeRequest } from "../../axi.js";
import { Link } from "react-router-dom";
import RiceBowlOutlinedIcon from "@mui/icons-material/RiceBowlOutlined";

export default function Home() {
  const arr = [1, 2, 3, 4, 5];
  const arr1 = [1, 2, 3, 4];

  const [loading, setLoading] = useState(false);
  const [mostPopular, setMostPopular] = useState([]);
  const [latest, setLatest] = useState([]);
  const [categories, setCategories] = useState([]);
 

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });

    fetchRecipes("popular", 4);
    fetchRecipes("latest", 8);
    fetchCategories();
  }, []);

  const fetchRecipes = async (type, limit) => {
    setLoading(true);
    try {
      const response = await makeRequest.get("/recipes/mainpage", {
        params: {
          type,
          limit,
        },
      });
      if (type == "popular") {
        setMostPopular(response.data);
      } else {
        setLatest(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch recipes:", error);
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    const value = "name asc";
    try {
      const response = await makeRequest.get("/categories/getall", {
        params: { sort: value },
      });
      const limitedCategories = response.data.filter(
        (_, index) => index < 3 || index === 4
      ); // Вибираємо перші три та п'ятий елемент
      setCategories(limitedCategories);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="home_page inter-regular ">
        <div className="img_section">
          <img src="/images/cake1.webp" alt="" />
        </div>

        <div className="section">
          <span className="montserrat-alternates-medium header2 green">
            Що приготувати?
          </span>
          <div className="category_list ">
            {categories.map((category) => (
              <div className="category_card" key={category.id}>
                <Link
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    width: "100%",
                  }}
                  to={"/recipes?page=1&category=" + category.id}
                >
                  <div className="inside">
                    <span className="category_name">{category.name}</span>
                    <RiceBowlOutlinedIcon />
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="recipe_section green_bg">
          <span className="montserrat-alternates-medium header2 green">
            Трендові Рецепти
          </span>
          <RecipesList recipes={mostPopular} type={"main"} />
        </div>

        <div className="recipe_section">
          <span className="montserrat-alternates-medium header2 green">
            Останні Додані
          </span>
          <RecipesList recipes={latest} />
        </div>

        <BannerFindRecipe />
      </div>
    </>
  );
}
