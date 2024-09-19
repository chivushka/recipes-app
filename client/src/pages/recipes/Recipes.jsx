import React, { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import RecipesList from "../../components/recipes_list/RecipesList";
import "./Recipes.scss";
import BannerFindRecipe from "../../components/banners/banner_findrecipe/BannerFindRecipe.jsx";
import Filter from "../../components/filter/Filter.jsx";
import { makeRequest } from "../../axi.js";
import Pagination from "../../components/pagination/Pagination.jsx";

export default function Recipes() {
  const recipesPerPage = 4;

  const [recipes, setRecipes] = useState([]);
  const [recipesTotal, setRecipesTotal] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
    fetchRecipes();
  }, []);

  useEffect(() => {
    fetchRecipes();
  }, [searchParams]);

  const fetchRecipes = async () => {
    try {
      const response = await makeRequest.get("/recipes/filter", {
        params: {
          time: searchParams.get("time") || "",
          sort: searchParams.get("sort") || "",
          category: searchParams.get("category") || "",
          cuisine: searchParams.get("cuisine") || "",
          difficulty: searchParams.get("difficulty") || "",
          level: searchParams.get("level") || "",
          page: searchParams.get("page") || 1,
          pageSize: searchParams.get("pageSize") || recipesPerPage,
        },
      });
      setRecipes(response.data.data);
      setRecipesTotal(response.data.totalRecipes);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch recipes:", error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const params = new URLSearchParams([...searchParams]);
    params.set(name, value);
    params.set("page", 1);
    navigate({
      pathname: location.pathname,
      search: params.toString(),
    });
  };

  return (
    <div className="recipes_page inter-regular">
      <div className="page_header">
        <span className="montserrat-alternates-medium header1">Рецепти</span>
        <div className="line" />
      </div>
      <Filter handleFilterChange={handleFilterChange} />
      <div className="recipe_section">
        {recipes.length !== 0 ? (
          <RecipesList recipes={recipes} />
        ) : (
          <div className="montserrat-alternates-bold header2 nothing">
            Нічого не знайдено з даними фільтрами
          </div>
        )}
        {recipesTotal > recipesPerPage && <Pagination totalPages={totalPages} />}
      </div>

      <BannerFindRecipe />
    </div>
  );
}
