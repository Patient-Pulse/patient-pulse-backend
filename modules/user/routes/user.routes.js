import express from "express";
import {
  updateUserStatus,
  getUsers,
  deleteUser,
  updateUserRole
} from "../controller/user.controller.js";
import authMiddleware from "../../auth/middleware/auth.middleware.js";

const router = express.Router();

router.put("/role", authMiddleware, updateUserRole);
router.put("/status", authMiddleware, updateUserStatus);
router.get("/", authMiddleware, getUsers);
router.delete("/:userId", authMiddleware, deleteUser);


export default router;
