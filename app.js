import "dotenv/config";

import express from "express";
import { connectDB } from "./utils/features.js";
import userRoute from "./routes/user.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
connectDB();
app.use(cookieParser());
app.use(express.json());

const allowedOrigins = ["http://localhost:5173", "http://localhost:4000"];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

app.use(cors(corsOptions));
// app.use(cors()); // Enable CORS for all origins

app.use("/api/user", userRoute);

app.get("/", (req, res) => {
  res.send("Saqlain your code is working");
});

const port = 4000;
app.listen(port, function listening(req, res) {
  console.log(`Server is running http://localhost:${port}`);
});
