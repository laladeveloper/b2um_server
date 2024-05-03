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
// const allowedOrigins = [
//   "http://localhost:5173",
//   "http://localhost:4000",
//   "https://b2um-rl1tv8zcd-laladevelopers-projects.vercel.app",
//   "https://b2um.vercel.app",
//   "https://b2um-server.vercel.app",
// ];

// const corsOptions = {
//   origin: function (origin, callback) {
//     // Check if the origin is in the list of allowed origins or if it's undefined (i.e., not set by the browser)
//     if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS understand saqlain"));
//     }
//   },
//   credentials: true,
// };

// app.use(cors(corsOptions));

app.use(
  cors({
    origin: "https://b2um.vercel.app", // Replace with your frontend origin
    credentials: true, // Allow cookies to be sent with the request
  })
);
app.use("/api/user", userRoute);
app.use("/api/admin", adminRoute);

app.get("/", (req, res) => {
  res.send("Saqlain your code is working");
});

const port = process.env.PORT;
app.listen(port, function listening(req, res) {
  console.log(`Server is running http://localhost:${port}`);
});
