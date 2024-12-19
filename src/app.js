const express=require("express");
const connectDB = require("./config/database")
const app=express();
const User = require("./models/user")
// app.use is responsible for all request (get,post....).
//  express.json ,It handling  the request and processing that JSON data 
//Express.json reads the json obect and convert it into javascript object and 
// add this js object back to req in req body
app.use(express.json()); 
app.post("/signup",async (req,res)=>{

console.log(req.body)
    //Creating a new instance of the User model
const user = new User(req.body); 
try {
    await user.save();
    res.send("User added successfully");
} catch (error) {
    res.status().send("Error Saving the user : ",error.meesage)
}   


})

connectDB()
.then(()=>{
    console.log("Database connection established");  
    app.listen(7777,()=>{
        console.log ("Server is runnibng on 7777........")
     })  
})
.catch((err)=>{
    console.log("Database cannot be successful");
    
})


