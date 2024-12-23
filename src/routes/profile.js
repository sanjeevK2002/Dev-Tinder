const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middleware/auth");

//cookies
profileRouter.get("/profile", userAuth ,  async (req,res)=>{
    try {
       const user =req.user;
  
      res.send(user)
  }
      catch (error) {
          res.status().send("Credential invalid  "+error.message)
      }
      
  });

module.exports = profileRouter;