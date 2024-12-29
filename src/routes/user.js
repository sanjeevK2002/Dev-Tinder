const express = require("express");
const { userAuth } = require("../middleware/auth");
const userRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const { set } = require("mongoose");
const user = require("../models/user");
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

// feed
userRouter.get("/feed",userAuth , async (req,res)=>{
    try{
        //User should see all the user card except
        //0. his owm card
        //1 . his connection
        //2. ignored people
        //3. already sent the connection request
        const loggedInUser = req.user;
         
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit>50?50:limit;
        const skip = (page - 1)*limit;
        

        const connectionRequest = await ConnectionRequest.find({
           $or:[{fromUserId : loggedInUser._id},
            {toUserId:loggedInUser._id}
           ],
        }).select("fromUserId , toUserId")

        const hideUserFromFeed = new Set();
        connectionRequest.forEach((req)=>{
            hideUserFromFeed.add(req.fromUserId.toString());
            hideUserFromFeed.add(req.toUserId.toString());
        })

        const users = await user.find({
          $and :  [{_id:{$nin : Array.from(hideUserFromFeed)}},
            {_id:{$ne:loggedInUser._id}}
          ]
        }).select(User_Safe_Data)
        .skip(skip)
        .limit(limit)
        res.send(users)

        

    }catch(error){
        if(!res.headersSent){
            res.status(400).send({message : error.message})
        }
    }
})


module.exports =userRouter;