import express from "express";
import { verifyAdmin } from "../utils/verifyToken.js";
import {
  addCategoriesToRecipe,
  addCategory,
  getCategories,
  updateCategoriesToRecipe,
} from "../controllers/category.js";

const router = express.Router();

router.post("/add", verifyAdmin, addCategory);
router.post("/addmany", addCategoriesToRecipe);
router.patch("/", updateCategoriesToRecipe)
// router.get("/one", )
router.get("/getall", getCategories);

export default router;
