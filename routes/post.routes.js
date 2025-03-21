import express from "express";

const router = express.Router();

router.get("/test", (req, res) => {
  res.send("hellow mofaka");
  console.log("test endpoint hit");
});

export default router;
