import React, { useEffect, useState } from "react";
import "./SavedRecipes.scss";
import useAuthStore from "../../../stores/authStore";
import { makeRequest } from "../../../axi";
import RecipesList from "../../../components/recipes_list/RecipesList";
import Pagination from "../../../components/pagination/Pagination";
import { useSearchParams } from "react-router-dom";

export default function SavedRecipes() {
  const recipesPerPage = 9;

  const { currentUser } = useAuthStore();
  const [searchParams] = useSearchParams();

  const [recipes, setRecipes] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecipes, setTotalRecipes] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
    console.log(currentUser.id);
    fetchSavedByUser(currentUser.id);
  }, []);

  useEffect(() => {
    fetchSavedByUser(currentUser.id);
  }, [searchParams]);

  const fetchSavedByUser = async (userId) => {
    try {
      const response = await makeRequest.get("/saves/byuser", {
        params: {
          userId: userId,
          pageSize: recipesPerPage,
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
    <div className="savedrecipes_page">
      <div className="top_container">
        <span className="montserrat-alternates-bold header2 ">
          Збережені рецепти Yumbook
        </span>
        <span>Рецепти що ви зберегли на Yumbook.</span>
      </div>
      <div className="line" />
      <div className="section">
        {recipes.length !== 0 ? (
          <>
            <RecipesList recipes={recipes} type={"profile"}/>
            {totalRecipes > recipesPerPage && (
              <Pagination totalPages={totalPages} />
            )}
          </>
        ) : (
          <>
            <span className="montserrat-alternates-bold header2 ">
              Ви ще не зберігали рецепти
            </span>
            <span>Перейдіть на вподобаний рецепт та натисніть "Зберегти"</span>
          </>
        )}
      </div>
    </div>
  );
}
