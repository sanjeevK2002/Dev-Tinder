const mongoose=require("mongoose");
const connectDB = async ()=>{
    await mongoose.connect("mongodb+srv://admin:s@codequest.k9fdd.mongodb.net/devtinder");
};

module.exports=connectDB;
