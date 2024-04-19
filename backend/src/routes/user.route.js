import { Router } from "express";
import  { signup } from "../controllers/user.controller.js"

const router = Router();

//signup route
router.route("/signup").post(signup)


export default router;