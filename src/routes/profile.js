const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const {validateEditProfileData} = require("../utils/validation")

//cookies
profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status().send("Credential invalid  " + error.message);
  }
});

//patch 
profileRouter.patch("/profile/edit", userAuth,async  (req, res) => {
    try{
    
         if(!validateEditProfileData(req)){
            throw new Error("Invalid Edit Request !!!")
         };

         const loggedInUSer = req.user;
         Object.keys(req.body).forEach((fields)=>loggedInUSer[fields] = req.body[fields])
         await loggedInUSer.save();
         res.json({message : `${loggedInUSer.firstName} , Your Profile Has Been Updated Successfully !!`,
              data : loggedInUSer}
         )
        }catch(error){
        res.status().send("ERROR : "+error.message)
    }
})

module.exports = profileRouter;
