import React, { useEffect, useState } from "react";
import "./RecipeProfile.scss";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import StarIcon from "@mui/icons-material/Star";
import FavoriteNotFilledIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteFilledIcon from "@mui/icons-material/FavoriteOutlined";
import StarOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import { makeRequest } from "../../../axi";
import moment from "moment";
import {
  calcCookTime,
  transformRecipeDifficulty,
} from "../../../utils/recipeUtils";
import useAuthStore from "../../../stores/authStore";
import NotFound from "../../../components/notfound/NotFound";

export default function RecipeProfile({ type }) {
  const { currentUser } = useAuthStore();

  const [recipe, setRecipe] = useState([]);
  const [cuisine, setCuisine] = useState([]);
  const [loading, setLoading] = useState(false);
  const [usersSaved, setUsersSaved] = useState([]);
  const [saved, setSaved] = useState(false);
  const params = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
    if (type === "public") {
      fetchRecipeById(params.recipeId, params.userId);
    } else {
      fetchRecipeById(params.recipeId);
    }
  }, []);

  useEffect(() => {
    console.log(recipe);
  }, [recipe]);

  const fetchRecipeById = async (recipeId, userId) => {
    setLoading(true);
    try {
      const response = await makeRequest.get("/recipes/one", {
        params: { id: recipeId, type: type, userId: userId },
      });
      setRecipe(response.data);
      fetchCuisineById(response.data.cuisineId);
    } catch (error) {
      console.log("Failed to fetch recipe:", error);
    }
    setLoading(false);
  };

  const fetchCuisineById = async (cuisineId) => {
    try {
      const response = await makeRequest.get("/cuisines/one", {
        params: { cuisineId: cuisineId },
      });
      setCuisine(response.data[0].name);
    } catch (error) {
      console.error("Failed to fetch cuisine:", error);
    }
  };

  const checkRecipe = (recipe) => {
    if (recipe.status === "Private") {
      if (currentUser.id === recipe.userId) return true;
      else return false;
    } else {
      return true;
    }
  };

  return (
    <div className="recipe_profile_page">
      {recipe.length !== 0 ? (
        <div className="recipe_profile_container">
          <div className="next_section">
            <div className="page_header">
              <div className="montserrat-alternates-medium header1">
                {recipe.title}
              </div>
            </div>

            <div className="details">
              <div className="details_inside">
                <div className="element">
                  <span className="element_title">{cuisine}</span>
                </div>
              </div>
            </div>
            <div className="introduction_section lh">{recipe.intro}</div>

            <div className="img_wrapper">
              {recipe.img !== "NULL" ? (
                <img src={"/upload/" + recipe.img}></img>
              ) : (
                <img src="/images/recipe.jpg"></img>
              )}
            </div>

            <div className="notes">
              <div className="notes_inside">
                <div className="notes_elem">
                  <span className="element_title lh">Приготування</span>
                  <span className="lh">{calcCookTime(recipe.cookTime)}</span>
                </div>
                <div className="notes_elem">
                  <span className="element_title lh">Порції</span>
                  <span className="lh">{recipe.servings}</span>
                </div>
                <div className="notes_elem">
                  <span className="element_title lh">Складність</span>
                  <span className="lh">
                    {transformRecipeDifficulty(recipe.difficulty)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bottom_container">
              <div className="right">
                <div className="madeby">
                  <span className="element_title lh">Автор</span>
                  <span className="lh">{recipe.userName}</span>
                </div>
                <div className="madeby">
                  <span className="element_title lh">Дата оновлення</span>
                  <span className="lh">
                    {moment(recipe.proposedAt).format("DD.MM.YYYY")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="ingredients_section">
            <div className="title header3 montserrat-alternates-medium">
              Список інгредієнтів
            </div>
            <ul>
              {recipe.ingredients &&
                recipe.ingredients.map((ingredient, index) => (
                  <li className="lh" key={index}>
                    {ingredient.text}
                  </li>
                ))}
            </ul>
          </div>

          <div className="directions_section">
            <div className="title header3 montserrat-alternates-medium">
              Кроки приготування
            </div>
            {recipe.directions &&
              recipe.directions.map((direction, index) => (
                <div className="direction" key={index}>
                  <div className="top">
                    <div className="name lh">Крок {index + 1}</div>
                    <div className="text lh">{direction.text}</div>
                  </div>
                  {direction.img !== "NULL" && (
                    <div className="img_wrapper">
                      <img src={"/upload/" + direction.img}></img>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      ) : (
        <NotFound text={"Рецепту"} />
      )}
    </div>
  );
}
