const User = require("../models/user");
const jwt = require("jsonwebtoken")

const userAuth=async (req,res,next)=>{
    try{
        const {token} = req.cookies;
        if(!token){
            throw new Error("TOken is not valid !!!");
        }
        const decodeObj = await jwt.verify(token ,"DEV@Tinder7098" );
        const {_id} = decodeObj;
        const user = await User.findById(_id);
        if(!user){
            throw new Error("User not found ");
        }
         req.user=user;  // whatever the user got , it just attached to object of req

         next();

    }catch(err){
        res.status(400).send("ERROR :- " + err.message)
    }
}

module.exports={userAuth}

