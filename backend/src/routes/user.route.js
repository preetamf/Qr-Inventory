import { Router } from "express";
import  { signup, login, logoutUser } from "../controllers/user.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

//signup route
router.route("/signup").post(signup)

//login route
router.route("/login").post(login)

//logout route
router.route("/logout").post(verifyJWT,  logoutUser)


export default router;