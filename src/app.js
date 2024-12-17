const express=require("express");
const app=express();



app.use("/host",(req,res)=>{
    res.send("this is use first2")
})

app.use("/test",(req,res)=>{
    res.send("this is use first test")
})

app.use("/",(req,res)=>{
    res.send("this is use first")
})

app.get("/",(req,res)=>{
    res.send("Hello express");    
});

app.listen(3000,()=>{
    console.log("server is running")
})