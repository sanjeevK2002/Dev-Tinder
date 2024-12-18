const express=require("express");
const app=express();
const {adminAuth,userAuth} =require("./middleware/auth.js")
//Handle Auth Middleware for all GET,POST,......request
app.use("/admin",adminAuth);

app.post("/user/login",(req,res)=>{
    res.send("User logged in successfully")
})

app.get("/user/data",userAuth,(req,res)=>{
    res.send("User data sent")
})

app.get("/admin/getAllUser",(req,res)=>{
    console.log("User is authorized");
    res.send("All data sent successfully")
    
})

app.listen(7777,()=>{
   console.log ("Server is runnibng on 7777........")
})