const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest")
const User =require("../models/user")

requestRouter.post("/request/send/:status/:toUserId",userAuth, async (req,res)=>{
   try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        
        const allowedStatus = ["ignored","interested"];
        if(!allowedStatus.includes(status)){
            return res
            .status(400)
            .json({message : "Invalid status type :" +status})
        }


        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or:[
                {fromUserId,toUserId},
                {fromUserId: toUserId , toUserId : fromUserId}
            ]
        })
        if(existingConnectionRequest){
            return res.status(400).send({message : `Connection Request of ${req.user.firstName} is already presence`})
        }

        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(404).send({message : `User not found`})
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });

        const data = await connectionRequest.save();
        res.json({

            message : req.user.firstName + " is "+ status + " in "+toUser.firstName,
            data,
        })
   }catch(error){
    if(!res.headersSent){
        res.status(400).send("Error : "+error.message)
    }
   }
})

module.exports=requestRouter;