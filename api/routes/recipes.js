import express from "express";
import {
  addRecipe,
  approveRecipe,
  deleteRecipe,
  getMainRecipes,
  getRecipe,
  getRecipesAdmin,
  getRecipesAll,
  getRecipesByUserForProfile,
  getRecipesFilter,
  rejectRecipe,
  updateRecipe,
} from "../controllers/recipe.js";
import { verifyToken, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/", verifyUser, addRecipe);
router.patch("/", verifyUser, updateRecipe);

router.get("/one", getRecipe);
router.get("/all", getRecipesAll);
router.get("/mainpage", getMainRecipes);
router.get("/filter", getRecipesFilter);
router.get("/byprofile", getRecipesByUserForProfile);

router.get("/getadmin", getRecipesAdmin);
router.delete("/:recipeId", verifyUser, deleteRecipe);

router.patch("/approve/:recipeId", approveRecipe)
router.patch("/reject/:recipeId", rejectRecipe)

export default router;
