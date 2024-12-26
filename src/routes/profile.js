const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const {validateEditProfileData} = require("../utils/validation");
const {validEditedPassword}  = require("../utils/validation")
 
/**
 * GET /profile
 * - Retrieves the authenticated user's profile.
 * - Requires `userAuth` middleware to validate the user.
 */
profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user; // Get user from middleware
    res.send(user); // Send user data as response
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).send("Credential invalid: " + error.message);
    }
  }
});

//patch 
profileRouter.patch("/profile/edit", userAuth,async  (req, res) => {
    try{
    
      if (!validateEditProfileData(req)) {
        res.status(400).send("Invalid Edit Request!!!");
        return; // Stop further execution if validation fails
      }

         const loggedInUSer = req.user;
         Object.keys(req.body).forEach((fields)=>loggedInUSer[fields] = req.body[fields])
         await loggedInUSer.save();
         res.json({message : `${loggedInUSer.firstName} , Your Profile Has Been Updated Successfully !!`,
              data : loggedInUSer}
         )
        }catch(error){
          if (!res.headersSent) {
            res.status(500).send("Something happend wrong : " + error.message);
          }
    }
})

//change password
profileRouter.patch("/profile/changePassword",userAuth, async (req,res)=>{
     try {

      if(! validEditedPassword){
        res.status().send("Unauthorized Request!!!")
        return;
      }
      const loggedInUSer = req.user;
      const oldPassword =  loggedInUSer.password;
      const Name = loggedInUSer.firstName;
     
        Object.keys(req.body).forEach((fields)=>oldPassword[fields] = req.body[fields]);
        await loggedInUSer.save();
        res.json({message : `${Name} , Your Password has been updated successfully! `})
      
     } catch (error) {
      if (!res.headersSent) {
        res.status(500).send("Please check your credential : " + error.message);
      }
     }
})

module.exports = profileRouter;
