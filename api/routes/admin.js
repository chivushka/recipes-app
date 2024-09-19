import express from "express";
import { verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/maininfo", verifyAdmin,);

export default router;