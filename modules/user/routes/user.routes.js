import express from "express";
import {
  updateUserStatus,
  getUsers,
  deleteUser,
  updateUserRole,
  registerUser
} from "../controller/user.controller.js";
import authMiddleware from "../../auth/middleware/auth.middleware.js";
import { runMigrations } from "../../../utils/migrationsRun.js";

const router = express.Router();

router.post('/register-user', authMiddleware, registerUser);
router.put("/role", authMiddleware, updateUserRole);
router.put("/status", authMiddleware, updateUserStatus);
router.get("/", authMiddleware, getUsers);
router.delete("/:userId", authMiddleware, deleteUser);
router.get('/run-migrations', runMigrations)

export default router;
