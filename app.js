import express from "express";
import cookieParser from "cookie-parser";
import postRoutes from "./routes/post.routes.js";
import authRoute from "./routes/auth.routes.js";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoute);

app.listen(8800, () => {
  console.log("server is running on port 8800");
});
