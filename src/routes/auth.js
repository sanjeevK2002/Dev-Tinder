const express = require("express");
const authRouter = express.Router();
const User= require("../models/user");
const {signupValidation} = require("../utils/validation");
const bcrypt = require("bcrypt");


//signup
authRouter.post("/signup", async (req,res)=>{
    // const user = new User(req.body); 
    try {
        // validation
        signupValidation(req)
        //Encrypt the password
        const {firstName, lastName , emailId , password ,age,gender} = req.body;
        const passwordHash = await bcrypt.hash(password , 10);
        //creating a new instance of the User model 
        const user = new User({
             firstName,
             lastName,
             emailId,
             password : passwordHash,
             age,
             gender
        });
        await user.save();
        res.send("User added usccessfully")
    } catch (err) {
        res.status(404).send("ERROR  :- "+ err.message)
    }
});


//Login
authRouter.post("/login",async (req,res)=>{
    try {
        const {emailId , password} = req.body; 
        const user = await User.findOne({emailId : emailId});
        if(!user){
            res.send("Invalid Emailid");
        }
        const isPasswordValid = await user.validatePassword(password);
        if (!isPasswordValid) {
            return res.status(401).send("Password is not correct  " +password);
        }
        if(isPasswordValid){   
            //create token 
            const token = await user.getJWT()//
            
            //Add the token to cookies and send the response back to the user
           res.cookie("token" ,token,{
            expires:new Date(Date.now()+3600000)
           });
            res.send("Login Successful !!!")
        }else{
            throw new Error("Some credentional is wrong")
        }
        
    } catch (error) {
        console.error("Error during login:", error.message); // Log error for debugging
        res.status().send("Credential invalid  "+error.message)
    }
})

//logout

authRouter.post("/logout",(req,res)=>{
    res.cookie("token" , null ,{
        expires : new Date(Date.now()),
    })
    res.send("Logout successfull");
})



module.exports=authRouter;