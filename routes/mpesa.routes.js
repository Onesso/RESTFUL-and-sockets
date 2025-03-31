import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { createToken, stkPush } from "../controllers/mpesa.controller.js";

const router = express.Router();

router.post("/", createToken, stkPush);

export default router;
