import express from "express";
import {
  createReceipt,
  getAllReceipts,
  getReceiptById,
} from "../controllers/receipt.controller.js";
import { verifyToken } from "../middleware/verifyToken.js"; // this os case sensitive it must have the dot extension present

const router = express.Router();

router.post("/save/:id", verifyToken, createReceipt); // Create a new receipt
router.get("/allreceipts", verifyToken, getAllReceipts); // Get all receipts
router.get("/:id", verifyToken, getReceiptById); // Get a specific receipt by ID

export default router;
