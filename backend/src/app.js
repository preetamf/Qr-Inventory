import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
})) // fix cross origin compatibility

app.use(express.urlencoded({ extended: true, limit: "16kb" })) //middleware recives data form URL of front-end
app.use(express.json({ limit: "16kb" })) //middleware recives json data from front-end
app.use(express.static("public")) //saving pdfs image files
app.use(cookieParser()) //get cookie data of user browser from server
app.use(bodyParser.json()) //body pasrser for json data


// routes import
import inventoryRouter from "./routes/inventory.route.js"
import userRouter from "./routes/user.route.js"


// route declaration
app.use("/api/v1", inventoryRouter)

app.use("/api/v1", userRouter)



export { app } 