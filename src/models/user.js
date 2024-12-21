const mongoose=require("mongoose");
const validator = require("validator")
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
module.exports= mongoose.model("User",userSchema);
