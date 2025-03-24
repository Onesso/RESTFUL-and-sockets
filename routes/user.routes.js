import express from "express";
import { login, logout, register } from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/", getUsers);

router.get("/:id", getUser);

router.put("/:id", updateUser);

router.delete("/:id", deleteUser);

export default router;
