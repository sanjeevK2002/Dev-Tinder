const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser =require("cookie-parser")
const jwt = require("jsonwebtoken")

//Express.json reads the json obect and convert it into javascript object and 
// add this js object back to req in req body
app.use(express.json());
app.use(cookieParser());


const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);

// //get data from emialId

// app.get("/user",async (req,res)=>{
//         const userEmail = req.body.emailId;
        
//         try {
//             const users= await User.find({ emailId : userEmail})            
//             if(users.length===0){
//                 res.status(404).send("User not found");
//             }
//             else{
//                 res.send(users)
//             }
//         } catch (error) {
//             res.status(404).send("Something went wrong");
//         }
// });






connectDB()
.then(()=>{
    console.log("Database connection established");  
    app.listen(7777,()=>{
        console.log("server is running on 7777");        
    })
})
.catch((err)=>{
    console.log("Database cannot be successful");
})