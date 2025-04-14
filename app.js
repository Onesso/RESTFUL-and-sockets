import express from "express";
import cookieParser from "cookie-parser";
import postRoutes from "./routes/post.routes.js";
import authRoute from "./routes/auth.routes.js";
import testRoute from "./routes/test.route.js";
import userRoute from "./routes/user.routes.js";
import chatRoute from "./routes/chat.routes.js";
import messageRoute from "./routes/message.routes.js";
import mpesaRoute from "./routes/mpesa.routes.js";
import receiptsRoute from "./routes/receipt.routes.js";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const app = express();

// app.use(cors({ origin: "http://localhost:5173", credentials: true }));
// app.use(cors({ origin: "http://localhost:5174", credentials: true })); //tenant
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];

// Configure CORS with multiple origins
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));



app.use(express.json());
app.use(cookieParser());

app.use("/api/post", postRoutes);
app.use("/api/auth", authRoute);
app.use("/api/test", testRoute);
app.use("/api/user", userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);
app.use("/api/mpesa", mpesaRoute);
app.use("/api/receipt", receiptsRoute);

app.listen(8800, () => {
  console.log("server is running on port 8800");
});
