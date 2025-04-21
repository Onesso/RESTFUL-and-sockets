import express from "express";
import {
  createReceipt,
  getAllReceiptsBySellerId,
  getReceipt,
  deleteReceipt,
} from "../controllers/receipt.controller.js";
import { verifyToken } from "../middleware/verifyToken.js"; // this os case sensitive it must have the dot extension present

const router = express.Router();

router.post("/save/:id", verifyToken, createReceipt); // Create a new receipt
router.get("/allreceipts/:id", verifyToken, getAllReceiptsBySellerId); // Get all receipts
router.get("/:id", verifyToken, getReceipt); // Get a specific receipt by ID
router.delete("/:id", verifyToken, deleteReceipt); // Delete a receipt by ID

export default router;
