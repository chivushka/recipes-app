import express from "express";
import { deleteUser, getUser, getUsers, updateUser } from "../controllers/user.js";
import { verifyAdmin, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/one/:userId", getUser);
router.get("/all", getUsers);
router.patch("/:userId", verifyUser, updateUser);
router.delete("/:userId", verifyAdmin, deleteUser)
// router.patch("/update/:userId", verifyAdmin, updateUser);

export default router;
