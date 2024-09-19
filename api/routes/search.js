import express from "express";
import { getSearchRecipesAndNews } from "../controllers/search.js";
import { verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/", getSearchRecipesAndNews);

export default router;
