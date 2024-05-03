import "dotenv/config";

import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import path from "path";
import adminRoute from "./routes/admin.js";
import userRoute from "./routes/user.js";
import { connectDB } from "./utils/features.js";
const __dirname = path.dirname(new URL(import.meta.url).pathname);

const app = express();
connectDB();
app.use(cookieParser());
app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:4000",
  "https://b2um-rl1tv8zcd-laladevelopers-projects.vercel.app/",
  "https://b2um.vercel.app/",
  "https://b2um-server.vercel.app/",
];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

// app.use(cors(corsOptions));
app.use(cors({credentials:true})); // Enable CORS for all origins

app.use("/api/user", userRoute);
app.use("/api/admin", adminRoute);

app.get("/", (req, res) => {
  res.send("Saqlain your code is working");
});
// for production mode from the server side 
// app.use(express.static(path.join(__dirname, "dist")));

// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "dist/index.html"));
// });
// D:\Web Dev\clients\Bunty Bhai\final website\backendServer\dist\index.html

const port = process.env.PORT;
app.listen(port, function listening(req, res) {
  console.log(`Server is running http://localhost:${port}`);
});
