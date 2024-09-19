import express from "express";
import { verifyUser } from "../utils/verifyToken.js";
import {
  addDirections,
  getDirectionsByRecipe,
  updateDirections,
} from "../controllers/direction.js";

const router = express.Router();

router.post("/addmany", verifyUser, addDirections);
router.patch("/", verifyUser, updateDirections);
router.get("/getbyrecipe", verifyUser, getDirectionsByRecipe);

export default router;
