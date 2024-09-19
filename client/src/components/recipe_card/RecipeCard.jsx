import React, { useEffect, useState } from "react";
import StarIcon from "@mui/icons-material/Star";
import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import Edit from "@mui/icons-material/EditNoteOutlined";
import "./RecipeCard.scss";
import { Link } from "react-router-dom";
import useAuthStore from "../../stores/authStore";
import { convertStatus } from "../../utils/recipeUtils";
import DeleteIcon from "@mui/icons-material/Delete";
import { makeRequest } from "../../axi";

export default function RecipeCard({ recipe, type, setRefetch, refetch }) {
  const starsArr = [1, 2, 3, 4, 5];

  const { currentUser } = useAuthStore();

  const [rate, setRate] = useState("none");

  const [profileStatus, setProfileStatus] = useState();

  useEffect(() => {
    FindRecipeRate();
    setProfileStatus(convertStatus(recipe.status, recipe.userId));
  }, []);

  const FindRecipeRate = async () => {
    let recipeRate = +recipe.currentRating;
    let count;
    if (recipeRate !== 0) {
      count = (recipeRate * 100) / 5;
      count = count.toString() + "%";
    } else {
      count = "0%";
    }
    console.log(count);
    setRate(count);
  };

  const deleteThisRecipe = async (recipeId) => {
    try {
      const response = await makeRequest.delete(
        `/recipes/${recipeId}?userId=${currentUser.id}`
      );
      setRefetch(!refetch);
      return response.data;
    } catch (error) {
      console.error("Failed to delete recipe:", error);
      throw error;
    }
  };

  const handleDelete = async (id) => {
    const choiceSure = confirm("Впевнені що хочете видалити рецепт ?");
    console.log(choiceSure);
    if (choiceSure) {
      try {
        await deleteThisRecipe(id);
        fetchRecipes();
      } catch (error) {
        console.error("Помилка при видаленні рецепту:", error);
        setErr("");
      }
    }
  };

  return (
    <div className={"recipe_card" + (!type ? " regular" : " white")}>
      <Link
        style={{ textDecoration: "none", color: "inherit", width: "100%" }}
        to={(profileStatus ? profileStatus.refer : "/recipes/") + recipe.id}
      >
        <div className="img_wrapper">
          {recipe.img !== "NULL" ? (
            <img src={"/upload/" + recipe.img}></img>
          ) : (
            <img src="/images/recipe.jpg"></img>
          )}
        </div>
      </Link>
      <div className="content">
        <div className="stars">
          {recipe.status === "Approved" && (
            <>
              <div className="stars__nofill">
                {starsArr.map((star, index) => (
                  <StarIcon
                    key={index}
                    style={{ color: "#FFCDCD", fontSize: "22px" }}
                  />
                ))}
                <div className="stars__filled" style={{ width: rate }}>
                  {starsArr.map((star, index) => (
                    <StarIcon
                      key={index}
                      style={{ color: "#E70000", fontSize: "22px" }}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
          {profileStatus &&
            profileStatus.stars === false &&
            type === "profile" && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <StickyNote2Icon
                  style={{ color: "#FFCDCD", fontSize: "22px" }}
                />
                Рецепт
              </div>
            )}
          {profileStatus && type === "personal" && (
            <>
              <div
                className="status"
                style={{ backgroundColor: profileStatus.color }}
              >
                {profileStatus.name}
              </div>
              {recipe.status !== "Approved" && (
                <div style={{display:"flex", justifyContent:"center", gap:"10px"}}>
                  <Link
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      width: "100%",
                    }}
                    to={"/profile/edit_recipe/" + recipe.id}
                  >
                    <Edit className="icon" />
                  </Link>
                  <DeleteIcon className="icon" onClick={() => {handleDelete(recipe.id)}} />
                </div>
              )}
            </>
          )}
        </div>
        <Link
          style={{ textDecoration: "none", color: "inherit", width: "100%" }}
          to={(profileStatus ? profileStatus.refer : "/recipes/") + recipe.id}
        >
          <span className="recipe_name inter-medium">{recipe.title} </span>
        </Link>
      </div>
    </div>
  );
}
