const express=require("express");
const app=express();





// This will only handle Get call to /user
app.get("/user",(req,res)=>{
    res.send({firstname:"sanjeev"});    
});

// saving data to db
app.post("/user",(req,res)=>{
    console.log("Save data to the database");
    
    res.send("data saved to the database")
})
// Delete the data
app.delete("/user",(req,res)=>{
    res.send("Deleted successfully")
})
// this will match all the http method API call
app.use("/test",(req,res)=>{
    res.send("this is use first")
})

app.listen(3000,()=>{
    console.log("server is running")
})