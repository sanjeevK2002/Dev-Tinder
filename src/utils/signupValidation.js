const validator = require("validator")

const signupValidation = (req)=>{
   const {firstName , lastName , emailId , password} = req.body;
   if(!firstName  || !lastName){
    throw new Error("Name is not valid");
   }else if(!validator.isEmail(emailId)){
    throw new Error("Emial is not valid");
   }else if (!validator.isStrongPassword(password)){
    throw new Error("Please enter strong password");
   }
};

module.exports = {signupValidation}