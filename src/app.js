const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser =require("cookie-parser")
const cors =require("./config/corsConfig")



//Express.json reads the json obect and convert it into javascript object and 
// add this js object back to req in req body
app.use(express.json());
app.use(cookieParser());
app.use(cors);



const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");;


app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);



connectDB()
.then(()=>{
    console.log("Database connection established");  
    app.listen(5000,()=>{
        console.log("server is running on 5000");        
    })
})
.catch((err)=>{
    console.log("Database cannot be successful");
})