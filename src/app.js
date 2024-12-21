const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User= require("./models/user");
const bcrypt = require("bcrypt");
const {signupValidation} = require("./utils/signupValidation");

//Express.json reads the json obect and convert it into javascript object and 
// add this js object back to req in req body
app.use(express.json());
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
        console.log(User);
        if(!User){
            res.send("Invalid Emailid");
        }

        const isPasswordValid = await bcrypt.compare(password , user.password);

        if(isPasswordValid){
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
            console.log(users);
            
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

//Feed api

app.get("/user",async (req,res)=>{
    try {
        const users = await User.find({});
        res.send(users)
    } catch (error) {
        res.status(404).send("Something went wrong");
        
    }
})

// find one user
app.get("/user",async (req,res)=>{
    const userEmail= req.body.emailId;
    console.log(userEmail);    
    try {
        const users = await User.findOne({emailId : userEmail});
       console.log(users)
        if(!userEmail){
            res.send("user not exist")
        }else{
            res.send(users);        }
        
    } catch (error) {
        res.status(404).send("Something went wrong");
    }
});
//delete data from database

app.delete("/user",async (req,res)=>{
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