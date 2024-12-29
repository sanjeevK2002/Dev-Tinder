const express = require("express");
const { userAuth } = require("../middleware/auth");
const userRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User_Safe_Data = "firstName lastName  photourl  age  gender  about";
//get all the pending request for the loggedIn User
userRouter.get("/user/request/received",userAuth , async (req,res)=>{
     try {const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequest.find({
           toUserId:loggedInUser._id,
           status:"interested"

        }).populate("fromUserId" ,User_Safe_Data);
        //.populate("fromUserId" ,["firstName" ,"lastName"]) // we can also write like this
        res.json({message : "Data fetched successfully",
            data : connectionRequest
        })
    }
        catch(error){
            if(!res.headersSent){
                res.status(500).send("ERROR : " + error.message);
            }
        }
   
})

//connection, who are connected to me 
userRouter.get("/user/connection",userAuth , async (req,res)=>{
    try {
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequest.find({
            $or:[
                {toUserId:loggedInUser._id , status:"accepted"},
                {fromUserId:loggedInUser._id , status:"accepted"}
            ]
        }).populate("fromUserId", User_Safe_Data )
         .populate("toUserId",User_Safe_Data)

        const data = connectionRequest.map((row)=>{
            if(row.fromUserId._id.toString() === loggedInUser._id.toString())
            {
                return row.toUserId;
            }
            return row.fromUserId;
        }
    )

        res.json({data })
        
    } catch (error) {
        if(!res.headersSent){
            res.status(500).send("ERROR : " + error.message);
        }
    }
})


module.exports =userRouter;