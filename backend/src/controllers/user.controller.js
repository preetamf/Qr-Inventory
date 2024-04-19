import {User} from "../models/user.model.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose";



// generate access and refresh tokens 
const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    return { accessToken, refreshToken }


  } catch (error) {
    throw (error)
  }
}



const signup = async (req, res) => {
  const { username, email, fullName, password } = req.body;

  // Basic checks (consider using a validation library for more robustness)
  if (!username || !email || !fullName || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Check for existing user (username or email)
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: "Email already exists" });
      } else {
        return res.status(400).json({ message: "Username already exists" });
      }
    }

    // Create and save user
    const user = new User({ username, email, fullName, password });
    await user.save();

    res.status(201).json({
      message: "User created successfully",
      user: {
        username: user.username,
        email: user.email,
        fullName: user.fullName,
      }
    });
  } catch (error) {
    // Handle Mongoose duplicate key errors
    if (error.message && error.message.includes("duplicate key")) {
      const duplicateField = error.message.match(/"([^"]*)"/)[1];
      return res.status(400).json({ message: `Duplicate ${duplicateField}` });
    }

    // Handle other errors (limited without libraries)
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Missing required fields (email and password)" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id) // Consider secure storage

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    //cookie option
    const options = {
      httpOnly: true,
      secure: true
  }

    res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({
      message: "Login successful",
      user: loggedInUser
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export { 
  signup,
  login, 
} 