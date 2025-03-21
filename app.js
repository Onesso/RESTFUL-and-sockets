import express from "express";
import cookieParser from "cookie-parser";
import postRoutes from "./routes/post.routes.js";
import authRoute from "./routes/auth.routes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/posts", postRoutes);

app.use("/api/auth", authRoute);

app.listen(8800, () => {
  console.log("server is running on port 8800");
});
