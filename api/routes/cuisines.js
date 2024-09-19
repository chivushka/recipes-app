import express from "express";
import {
  addCuisine,
  deleteCuisine,
  getCuisine,
  getCuisinesAdmin,
  getCuisinesAll,
  updateCuisine,
} from "../controllers/cuisine.js";
import { verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/add", verifyAdmin, addCuisine);
router.get("/one", getCuisine);
router.get("/getall", getCuisinesAll);
router.get("/getadmin", getCuisinesAdmin);

router.delete("/:cuisineId", verifyAdmin, deleteCuisine);
router.patch("/:cuisineId", verifyAdmin, updateCuisine);
// router.post("/confirm", confirmRecipe)
// router.post("/decline", declineREcipe)
// router.get("/update", updateRecipe)
// router.get("/delete", deleteRecipe)

export default router;
