import dotenv from "dotenv"
import { app } from "./app.js";
import connectDB from "./db/dbConnect.js";


dotenv.config({
    path: './.env'
})

//initialise port where server runs
const port = process.env.PORT || 8000;

//DB connection : It is async method retuns promise
connectDB()
.then( () => {
    //run or listen the server on specific port
    app.listen( port, () => {
        console.log(`App is live at PORT : http://localhost:${port}`)
    })
})
.catch((error) => {
    console.log("MongoDB connection failed : ", error);
})



