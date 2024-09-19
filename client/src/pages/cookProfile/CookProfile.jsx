import React, { useEffect, useState } from "react";
import "./CookProfile.scss";
import { Link, useParams } from "react-router-dom";
import { makeRequest } from "../../axi";
import { transformUserLevel } from "../../utils/userUtils";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import NotFound from "../../components/notfound/NotFound";
import { isObjEmpty } from "../../utils/combinedUtils";
import RecipesList from "../../components/recipes_list/RecipesList";

export default function CookProfile() {
  const maxRecipes = 4;
  const maxSavedRecipes = 4;

  const [userInfo, setUserInfo] = useState({});
  const [recipes, setRecipes] = useState([]);
  const [recipesTotal, setRecipesTotal] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [savedRecipesTotal, setSavedRecipesTotal] = useState([]);
  const params = useParams();

  const [err, setErr] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
    fetchUserById(params.id);
    fetchRecipesByUser(params.id);
    fetchSavedByUser(params.id);
  }, []);

  const fetchRecipesByUser = async (userId) => {
    try {
      const response = await makeRequest.get("/recipes/byprofile", {
        params: {
          userId: userId,
          notstatus: "Private",
          pageSize: maxRecipes,
          order: "status",
        },
      });
      console.log(response.data);
      setRecipes(response.data.recipes);
      setRecipesTotal(response.data.total);
    } catch (error) {
      console.error("Failed to fetch recipe:", error);
    }
  };
  const fetchSavedByUser = async (userId) => {
    try {
      const response = await makeRequest.get("/saves/byuser", {
        params: { userId: userId, pageSize: maxSavedRecipes },
      });
      console.log(response.data);
      setSavedRecipes(response.data.recipes);
      setSavedRecipesTotal(response.data.total);
    } catch (error) {
      console.error("Failed to fetch recipe:", error);
    }
  };

  const fetchUserById = async (userId) => {
    try {
      const response = await makeRequest.get(`/users/one/${userId}`);
      setUserInfo(response.data);
    } catch (error) {
      console.log(error.response.status);
      if (error.response.status === 500) {
        setErr("Користувача не існує");
        setUserInfo({});
      }
    }
  };

  return (
    <div className="cookprofile_page inter-regular">
      {isObjEmpty(userInfo) ? (
        <div style={{ paddingTop: "min(3rem,3vh)" }}>
          <NotFound text={"Користувача"} />
        </div>
      ) : (
        <>
          <img className="cover" src="/images/about3.webp" />
          <div className="profile_container">
            <div className="about_cook">
              <div className="img_wrapper">
                <img
                  src={
                    userInfo.profilePic!=="NULL"
                      ? ("/upload/" + userInfo.profilePic)
                      : ("/images/cookdefault.jpg")
                  }
                />
              </div>
              <div className="info">
                <div className="montserrat-alternates-bold header2">
                  {userInfo.name}
                </div>
                <div className="level inter-medium header4">
                  <RestaurantMenuIcon />
                  {transformUserLevel(userInfo.level).toLowerCase()}
                </div>
                {userInfo.about && <div className="">{userInfo.about}</div>}
              </div>
            </div>
          </div>
          {recipes.length !== 0 && (
            <div className="recipes_container">
              <div className="page_header">
                <span className="montserrat-alternates-medium header1">
                  Власні рецепти
                </span>
                <div className="line" />
              </div>
              <RecipesList recipes={recipes} type={"profile"} />
              {recipesTotal > maxRecipes && (
                <Link
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                  }}
                  to={`/cook/${userInfo.id}/ownrecipes`}
                >
                  <button className="viewall">Переглянути всі</button>
                </Link>
              )}
            </div>
          )}
          {savedRecipes.length !== 0 && (
            <div className="recipes_container">
              <div className="page_header">
                <span className="montserrat-alternates-medium header1">
                  Вподобані рецепти
                </span>
                <div className="line" />
              </div>
              <RecipesList recipes={savedRecipes} type={"profile"} />
              {savedRecipesTotal > maxSavedRecipes && (
                <Link
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                  }}
                  to={`/cook/${userInfo.id}/saved`}
                >
                  <button className="viewall">Переглянути всі</button>
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
