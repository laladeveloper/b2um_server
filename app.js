import "dotenv/config";

import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import productRoute from "./routes/product.js";
import userRoute from "./routes/user.js";
import reviewRoute from "./routes/review.js";
import { connectDB } from "./utils/features.js";

const app = express();
connectDB();
app.use(cookieParser());
app.use(express.json());

app.use(cors());
app.use("/api/user", userRoute);
app.use("/api/product", productRoute);
app.use("/api/reviews", reviewRoute);

app.get("/", (req, res) => {
  res.send("Saqlain your code is working");
});

const port = process.env.PORT;
app.listen(port, function listening(req, res) {
  console.log(`Server is running on http://localhost:${port}`);
});
