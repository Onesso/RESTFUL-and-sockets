import express from "express";
import postRoutes from "./routes/post.routes.js";

const app = express();

app.use("/api/posts", postRoutes);

app.listen(8800, () => {
  console.log("server is running on port 8800");
});
