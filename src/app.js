const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User= require("./models/user");
const bcrypt = require("bcrypt");
const cookieParser =require("cookie-parser")
const jwt = require("jsonwebtoken")
const {signupValidation} = require("./utils/signupValidation");

//Express.json reads the json obect and convert it into javascript object and 
// add this js object back to req in req body
app.use(express.json());
app.use(cookieParser());
//signup
app.post("/signup", async (req,res)=>{
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

app.post("/login",async (req,res)=>{
    try {
        const {emailId , password} = req.body;        
        const user = await User.findOne({emailId : emailId});
        if(!user){
            res.send("Invalid Emailid");
        }

        const isPasswordValid = await bcrypt.compare(password , user.password);

        if(isPasswordValid){   
            //create token 
            const token = await jwt.sign({_id : user._id }, "DEV@Tinder7098")
            console .log(token)
            //Add the token to cookies and send the response back to the user
           res.cookie("token" ,token)
            res.send("Login Successful !!!")
        }else{
            throw new Error("Some credentional is wrong")
        }
        
    } catch (error) {
        res.status().send("Credential invalid  "+error.message)
    }
})

//get data from emialId

app.get("/user",async (req,res)=>{
        const userEmail = req.body.emailId;
        
        try {
            const users= await User.find({ emailId : userEmail})            
            if(users.length===0){
                res.status(404).send("User not found");
            }
            else{
                res.send(users)
            }
        } catch (error) {
            res.status(404).send("Something went wrong");
        }
});
//cookies
app.get("/profile",async (req,res)=>{
  try {
     const cookies = req.cookies;

    const {token} = cookies;
    //validate my token
    if(!token){
        throw new Error("Invalid Token ");
    }
    const decodeMessage = await jwt.verify(token , "DEV@Tinder7098")
    const {_id} = decodeMessage;

    const user = await User.findById(_id);
    if(!user){
        throw new Error("User does not exist !!!!");
    }
    res.send(user)
}
    catch (error) {
        res.status().send("Credential invalid  "+error.message)
    }
    
});



//Feed api

app.get("/feed",async (req,res)=>{
    try {
        const users = await User.find({});
        res.send(users)
    } catch (error) {
        res.status(404).send("Something went wrong");
        
    }
})

// find one user
app.get("/find",async (req,res)=>{
    const userEmail= req.body.emailId;
    try {
        const users = await User.findOne({emailId : userEmail});
        if(!userEmail){
            res.send("user not exist")
        }else{
            res.send(users);        }
        
    } catch (error) {
        res.status(404).send("Something went wrong");
    }
});
//delete data from database

app.delete("/delete",async (req,res)=>{
    const userID= req.body._id;
    try{
        const users = await User.findByIdAndDelete({_id : userID})
        // const users = await User.findByIdAndDelete(userID);
        res.send("deleted successfully")

    }catch(err){
        res.status(404).send("Not deleted")
    }
})

//PATCH
app.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body;

    try {
        const ALLOWED_UPDATES = ["age", "gender", "photourl", "about", "skills"];
        const isUpdateAllowed = Object.keys(data).every((key) =>
            ALLOWED_UPDATES.includes(key)
        );
        if (!isUpdateAllowed) {
            return res.status(400).send("Update not allowed: Invalid field(s) in request");
        }

        if(data?.skills.length>10){
            throw new Error("Skills not more than 10 .")
        }
        const updatedUser = await User.findByIdAndUpdate( userId, data,
            {
                returnDocument:"after",
                new: true, // Use `new: true` for returning the updated document
                runValidators: true, // Ensure validation rules are applied
            }
        );
        if (!updatedUser) {
            return res.status(404).send("User not found");
        }

        res.status(200).send(updatedUser); // Send the updated user document
    } catch (error) {
        console.error("Error during update:", error);
        res.status(500).send("Failed to update");
    }
});



connectDB()
.then(()=>{
    console.log("Database connection established");  
    app.listen(7777,()=>{
        console.log("server is running on 7777");        
    })
})
.catch((err)=>{
    console.log("Database cannot be successful");
})