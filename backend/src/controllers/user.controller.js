import {User} from "../models/user.model.js"


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
    return res.status(500).json({
      success: false,
      message: "Something went wrong while generating referesh and access token"
    })
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


export { signup } 