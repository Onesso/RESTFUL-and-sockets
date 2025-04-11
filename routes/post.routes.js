import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  getPosts,
  getPost,
  addPost,
  updatePost,
  deletePost,
  getToken,
  processPayment,
  getSettlementReport,
} from "../controllers/post.controller.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/:id", getPost);
router.post("/", verifyToken, addPost);
router.put("/:id", verifyToken, updatePost);
router.delete("/:id", verifyToken, deletePost);
router.get("/braintree/token", getToken);
router.post("/braintree/payment", verifyToken, processPayment);
router.post("/braintree/api/settlement-data", verifyToken, getSettlementReport);

export default router;
