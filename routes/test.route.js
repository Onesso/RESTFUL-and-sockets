import express from "express";
import {
  shouldbeloggedin,
  shouldbeadmin,
} from "../controllers/test.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/should-be-logged-in",verifyToken, shouldbeloggedin);
router.get("/should-be-admin", shouldbeadmin);

export default router;
