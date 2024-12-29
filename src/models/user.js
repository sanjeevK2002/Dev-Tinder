const mongoose=require("mongoose");
const validator = require("validator")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true,
        minLength:4,
        maxLenght:100

        
    },
    lastName:{
        type:String,
        required:true,
    },
    emailId:{
        type:String,
        lowercase:true,
        require:true,
        unique:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email address is not valid ",+value)
            }
        }

    },
    password: {
        type: String,
        required: true,
        // validate(value) {
        //     if (!validator.isStrongPassword(value)) {
        //         throw new Error(`Enter a strong password: ${value}`);
        //     }
        // },
    },
    
    age:{
        type:Number,
        required:true,
        min:18,
        max:50,
    },
    gender:{
        type:String,
        required:true,
        validate(value){
            if(!["male","female","other"].includes(value)){
                throw new Error("Gender data is not valid")
            }
        },
    },
    photourl:{
        type:String,
        default:"https://images.app.goo.gl/iiDW1VxQhiN1M4A78",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid photo url  ",+value)
            }
        }
    },
    about:{
        type:String,
        default:"This is a default about of the user"
    },
    skills:{
        type:[String],
    }
    
},
{
    timestamps:true,
});

userSchema.index({firstName : 1 , lastName : 1})
userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, "DEV@Tinder7098", {
        expiresIn: "7d",
    });
    return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    
   try{ const user = this;
    const passwordHash = user.password;
    
    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);
    
    return isPasswordValid;
    }catch(err){
        console.error("Error validating password:", err);
        return false; // Return false if comparison fails
    }
};



module.exports= mongoose.model("User",userSchema);
