import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"


export const verifyJWT = async (req, _, next) => {
    try {
      // Retrieve access token from cookies or Authorization header
      const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
  
      // Validate token presence
      if (!token) {
        throw new Error("Unauthorized: Missing access token"); // Provide informative error message
      }
  
      // Verify token using secret key
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  
      // Fetch user data, excluding password and refresh token
      const user = await User.findById(decodedToken._id).select("-password -refreshToken");
  
      // Validate user existence
      if (!user) {
        throw new Error("Unauthorized: Invalid access token"); // Informative error for invalid token
      }
  
      // Attach user to request object for further use
      req.user = user;
  
      // Proceed to next middleware or route handler
      next();
    } catch (error) {
      console.error(error); 
      return res.status(401).json({ error: "Unauthorized" });
    }
  };