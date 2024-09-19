import React, { useEffect, useState } from "react";
import "./MyRecipes.scss";
import PlusIcon from "@mui/icons-material/Add";
import { Link, useSearchParams } from "react-router-dom";
import useAuthStore from "../../../stores/authStore";
import { makeRequest } from "../../../axi";
import RecipesList from "../../../components/recipes_list/RecipesList";
import Pagination from "../../../components/pagination/Pagination.jsx";

export default function MyRecipes() {
  const recipesPerPage = 9;

  const [recipes, setRecipes] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecipes, setTotalRecipes] = useState(0);
  const[refetchR, setRefetchR] = useState(false)

  const { currentUser } = useAuthStore();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
    fetchRecipesByUser(currentUser.id);
  }, []);

  useEffect(() => {
    fetchRecipesByUser(currentUser.id);
  }, [searchParams]);

  useEffect(() => {
    fetchRecipesByUser(currentUser.id);
  }, [refetchR]);

  const fetchRecipesByUser = async (userId) => {
    try {
      const response = await makeRequest.get("/recipes/byprofile", {
        params: {
          userId: userId,
          pageSize: recipesPerPage,
          order: "id",
          by: "asc",
          page: searchParams.get("page") || 1,
        },
      });
      setRecipes(response.data.recipes);
      setTotalPages(response.data.totalPages);
      setTotalRecipes(response.data.total);
    } catch (error) {
      console.error("Failed to fetch recipe:", error);
    }
  };
  return (
    <div className="yourrecipes_page">
      <div className="top_container">
        <span className="montserrat-alternates-bold header2 ">
          Особисті рецепти Yumbook
        </span>
        <span>Рецепти які ви створили на Yumbook.</span>
        <span className="additional_info">
          Інші користувачі будуть бачити рецепти що ви зробили публічними.
        </span>
      </div>

      <div className="line" />
      <div className="section">
        {recipes.length !== 0 ? (
          <>
            <Link
              style={{ textDecoration: "none", color: "inherit" }}
              to={"/profile/add_recipe"}
            >
              <button className="add">
                Додати рецепт
                <PlusIcon style={{fontSize: "20px" }} className="icon"/>
              </button>
            </Link>
            <RecipesList recipes={recipes} type={"personal"} refetch={refetchR} setRefetch={setRefetchR}/>
            {totalRecipes > recipesPerPage && (
              <Pagination totalPages={totalPages} />
            )}
          </>
        ) : (
          <>
            <span className="montserrat-alternates-bold header2 ">
              Ви ще не створювали ніякі рецепти
            </span>
            <span>Щоб додати рецепт натисніть кнопку</span>
            <Link
          style={{ textDecoration: "none", color: "inherit" }}
          to={"/profile/add_recipe"}
        >
          <button className="add">
            Додати рецепт
            <PlusIcon style={{fontSize: "20px" }} className="icon"/>
          </button>
        </Link>
          </>
        )}
      </div>
      <div className="main_container"></div>
    </div>
  );
}
