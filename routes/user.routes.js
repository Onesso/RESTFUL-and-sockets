import express from "express";
import { login, logout, register } from "../controllers/auth.controller";

const router = express.Router();

router.post("/Register", register);

router.post("/Login", login);

router.post("/Logout", logout);

export default router;
