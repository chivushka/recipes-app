import express from "express";
import { verifyAdmin, verifyUser } from "../utils/verifyToken.js";
import {
  addSave,
  deleteSave,
  getSavedRecipes,
  getSaves,
} from "../controllers/save.js";

const router = express.Router();

router.get("/", getSaves);
router.post("/", verifyUser, addSave);
router.delete("/", verifyUser, deleteSave);
router.get("/byuser", getSavedRecipes);

export default router;
