import express from "express";
import { verifyUser } from "../utils/verifyToken.js";
import {
  addIngredient,
  addIngredients,
  deleteIngredient,
  getIngredientsByRecipe,
  updateIngredient,
  updateIngredients,
} from "../controllers/ingredient.js";

const router = express.Router();

router.post("/addmany", verifyUser, addIngredients);
router.patch("/", verifyUser, updateIngredients);
router.get("/allrecipe", getIngredientsByRecipe);

export default router;
