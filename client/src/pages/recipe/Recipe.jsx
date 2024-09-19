import React, { useEffect, useState } from "react";
import "./Recipe.scss";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import StarIcon from "@mui/icons-material/Star";
import FavoriteNotFilledIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteFilledIcon from "@mui/icons-material/FavoriteOutlined";
import StarOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import { makeRequest } from "../../axi";
import moment from "moment";
import { calcCookTime, convertReviewsCount, transformRecipeDifficulty } from "../../utils/recipeUtils";
import useAuthStore from "../../stores/authStore";
import NotFound from "../../components/notfound/NotFound";
import AddReview from "../../components/add_review/AddReview";
import Reviews from "../../components/reviews/Reviews";

export default function Recipe() {
  const { currentUser } = useAuthStore();

  const [recipe, setRecipe] = useState([]);
  const [cuisine, setCuisine] = useState([]);

  const [usersSaved, setUsersSaved] = useState([]);
  const [saved, setSaved] = useState(false);

  const [refetchR, setRefetchR] = useState(true);
  const [reviewsCount, setReviewsCount] = useState("0");

  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
    fetchRecipeById(params.recipeId);
    fetchUsersIdThatSaved(params.recipeId);
    fetchReviewsCountByRecipe(params.recipeId);
  }, []);

  useEffect(() => {
    if (currentUser) {
      if (usersSaved.includes(currentUser.id)) {
        setSaved(true);
      } else {
        setSaved(false);
      }
    } else {
      setSaved(false);
    }
  }, [usersSaved]);

  

  const handleSave = async () => {
    if (!saved) {
      await addSaved(params.recipeId);
    } else {
      await deleteSaved(params.recipeId);
    }
    fetchUsersIdThatSaved(params.recipeId); // Fetch the updated list of users who saved the recipe
  };

  const fetchRecipeById = async (recipeId) => {
    try {
      const response = await makeRequest.get("/recipes/one", {
        params: { id: recipeId, type: "approved" },
      });
      setRecipe(response.data);
      fetchCuisineById(response.data.cuisineId);
    } catch (error) {
      console.log("Failed to fetch recipe:", error);
    }
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

  const fetchUsersIdThatSaved = async (recipeId) => {
    try {
      const response = await makeRequest.get("/saves/", {
        params: { recipeId: recipeId },
      });
      console.log(response.data);
      setUsersSaved(response.data);
    } catch (error) {
      console.error("Failed to fetch users that saved:", error);
    }
  };

  const addSaved = async (recipeId) => {
    try {
      await makeRequest.post("/saves/", {
        userId: +currentUser.id,
        recipeId: +recipeId,
      });
    } catch (error) {
      console.error("Failed to save recipe:", error);
    }
  };

  const deleteSaved = async (recipeId) => {
    try {
      await makeRequest.delete("/saves/", {
        params: { userId: +currentUser.id, recipeId: +recipeId },
      });
    } catch (error) {
      console.error("Failed to delete recipe:", error);
    }
  };

  const fetchReviewsCountByRecipe = async (recipeId) => {
    try {
      const response = await makeRequest.get("/reviews/getcountapproved", {
        params: { recipeId: recipeId },
      });
      const result = convertReviewsCount(response.data.count);
      setReviewsCount(result);
    } catch (error) {
      console.error("Failed to fetch users that saved:", error);
    }
  };

  return (
    <div className="recipe_page">
      {recipe.length !== 0 ? (
        <>
          <div className="recipe_container">
            <div className="next_section">
              <div className="page_header">
                <div className="montserrat-alternates-medium header1">
                  {recipe.title}{" "}
                </div>
              </div>

              <div className="details">
                <div className="details_inside">
                  <div className="element">
                    <span className="element_title">{cuisine}</span>
                  </div>
                  <div className="element">
                    <span className="rating element_title">
                      {recipe.currentRating}
                    </span>
                    <StarIcon style={{ color: "#E70000", fontSize: "20px" }} />
                  </div>
                  <div className="element">
                    <span className=" review element_title">
                      {reviewsCount}
                    </span>
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

              <div className="buttons_and_info">
                <div className="left">
                  {currentUser ? (
                    <button onClick={handleSave} className="default">
                      {saved ? (
                        <>
                          <FavoriteFilledIcon
                            style={{ color: "#ffeaea", fontSize: "18px" }}
                            className="icon"
                          />
                        </>
                      ) : (
                        <>
                          Зберегти{" "}
                          <FavoriteNotFilledIcon
                            style={{ color: "#ffeaea", fontSize: "18px" }}
                            className="icon"
                          />
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      className="default"
                      onClick={() => {
                        navigate("/signin");
                      }}
                    >
                      Зберегти{" "}
                      <FavoriteNotFilledIcon
                        style={{ color: "#ffeaea", fontSize: "18px" }}
                        className="icon"
                      />
                    </button>
                  )}
                  <button className="default">
                    Оцінити{" "}
                    <StarOutlinedIcon
                      style={{ color: "#E70000", fontSize: "18px" }}
                      className="icon"
                    />
                  </button>
                </div>
                <div className="right">
                  <div className="madeby">
                    <span className="element_title lh">Дата оновлення</span>
                    <span className="lh">
                      {moment(recipe.updatedAt).format("DD.MM.YYYY")}
                    </span>
                  </div>
                  <div className="madeby">
                    <span className="element_title lh">Автор</span>
                    <span className="lh">{recipe.userName}</span>
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
                    {direction.img !== "NULL" && direction.img  && (
                      <div className="img_wrapper">
                        <img src={ "/upload/" + direction.img}></img>
                      </div>
                    )}
                  </div>
                ))}
              <div className="buttons_and_info">
                <div className="left">
                  {currentUser ? (
                    <button onClick={handleSave} className="radiused">
                      {saved ? (
                        <>
                          <FavoriteFilledIcon
                            style={{ color: "#ffeaea", fontSize: "18px" }}
                            className="icon"
                          />
                        </>
                      ) : (
                        <>
                          Зберегти{" "}
                          <FavoriteNotFilledIcon
                            style={{ color: "#ffeaea", fontSize: "18px" }}
                            className="icon"
                          />
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      className="radiused"
                      onClick={() => {
                        navigate("/signin");
                      }}
                    >
                      Зберегти{" "}
                      <FavoriteNotFilledIcon
                        style={{ color: "#ffeaea", fontSize: "18px" }}
                        className="icon"
                      />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="review_add_section">
            <div className="header3 montserrat-alternates-medium title">
              Залиште свій відгук
            </div>
            <AddReview setRefetchR={setRefetchR} />
          </div>
          <div className="recipe_container">
            <div className="reviews_section">
              <div className="header3 montserrat-alternates-medium title">
                Всі відгуки
              </div>
              <Reviews refetchR={refetchR} setRefetchR={setRefetchR} />
            </div>
          </div>
        </>
      ) : (
        <NotFound text={"Рецепту"} />
      )}
    </div>
  );
}
