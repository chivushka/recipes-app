import React, { useEffect, useState } from "react";
import "./CookShowAll.scss";
import { useParams, useSearchParams } from "react-router-dom";
import { makeRequest } from "../../axi";
import { transformUserLevel } from "../../utils/userUtils";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import NotFound from "../../components/notfound/NotFound";
import { isObjEmpty } from "../../utils/combinedUtils";
import RecipesList from "../../components/recipes_list/RecipesList";
import Pagination from "../../components/pagination/Pagination";

export default function CookShowAll({ type }) {
  const recipesPerPage = 8;

  const [userInfo, setUserInfo] = useState({});
  const [recipes, setRecipes] = useState([]);
  const [recipesTotal, setRecipesTotal] = useState(0);
  const [recipesTotalPages, setRecipesTotalPages] = useState(0);

  const params = useParams();
  const [searchParams] = useSearchParams();

  const [fetchFunc, setFetchFunc] = useState(null);

  const [err, setErr] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
    fetchUserById();
    if (type === "saved") {
      fetchSavedByUser();
    } else {
      fetchRecipesByUser();
    }
  }, []);

  useEffect(() => {
    if (type === "saved") {
      fetchSavedByUser();
    } else {
      fetchRecipesByUser();
    }
  }, [searchParams]);

  const fetchUserById = async () => {
    const userId = params.id;
    try {
      const response = await makeRequest.get(`/users/one/${userId}`);
      setUserInfo(response.data);
    } catch (error) {
      console.log(error);
      if (error.response.status === 500) {
        setErr("Користувача не існує");
        setUserInfo({});
      }
    }
  };

  const fetchRecipesByUser = async () => {
    const userId = params.id;
    try {
      const response = await makeRequest.get("/recipes/byprofile", {
        params: {
          userId: userId,
          notstatus: "Private",
          pageSize: recipesPerPage,
          order: "status",
          page: searchParams.get("page") || 1,
        },
      });
      console.log(response.data);
      setRecipes(response.data.recipes);
      setRecipesTotal(response.data.total);
      setRecipesTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch recipe:", error);
    }
  };
  const fetchSavedByUser = async () => {
    const userId = params.id;
    try {
      const response = await makeRequest.get("/saves/byuser", {
        params: {
          userId: userId,
          pageSize: recipesPerPage,
          page: searchParams.get("page") || 1,
        },
      });
      console.log(response.data);
      setRecipes(response.data.recipes);
      setRecipesTotal(response.data.total);
      setRecipesTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch recipe:", error);
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
                    userInfo.profilePic !== "NULL"
                      ? "/upload/" + userInfo.profilePic
                      : "/images/cookdefault.jpg"
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
                  {type === "saved"
                    ? "Всі вподобані рецепти"
                    : "Всі власні рецепти"}
                </span>
                <div className="line" />
              </div>
              <RecipesList recipes={recipes} type={"profile"} />
              {recipesTotal > recipesPerPage && (
                <Pagination totalPages={recipesTotalPages} />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
