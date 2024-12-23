const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middleware/auth");

requestRouter.post("/sendConnectionRequest",userAuth, async (req,res)=>{
    const user = req.user;
    // sending a connection request
    console.log("sending a connection request");
    res.send("Connection has been sent by :- "+user.firstName);

    res.send("Connection Request Sent !")
})

module.exports=requestRouter;