import express from "express";
import {
  shouldbeloggedin,
  shouldbeadmin,
} from "../controllers/test.controller.js";

const router = express.Router();

router.get("/should-be-logged-in", shouldbeloggedin);
router.get("/should-be-admin", shouldbeadmin);

export default router;
