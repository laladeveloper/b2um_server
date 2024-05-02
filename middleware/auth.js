import jwt from "jsonwebtoken";
import User from "../models/user.js";
import asynchandler from "express-async-handler";

const protect = asynchandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // get token from headers
      token = req.headers.authorization.split(" ")[1];

      // verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // get user from token
      req.user = await User.findById(decoded.id).select("-password");

      // end of middleware
      next();
    } catch (error) {
      console.log(error);
      res.status(401).json({
        success: false,
        message: "Not Authorized",
      });
    }
  }

  if (!token) {
     res.status(401).json({
       success: false,
       message: "Not Authorized, not token",
     });
}
});

export default protect;
