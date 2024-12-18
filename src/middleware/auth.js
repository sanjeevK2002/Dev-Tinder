const adminAuth=(req,res,next)=>{
    console.log("Admin auth is getting checked");    
    const token ="sanjeev";
    const isAdminAuthorized = token  ==="sanjeev";
    if(!isAdminAuthorized){
        console.log("User is not authorized"); 
        res.status(401).send("Unauthorized User")       
    }else{
        next();
    }
}

const userAuth=(req,res,next)=>{
    console.log("USer auth is getting checked");    
    const token ="sanjeev45";
    const isAdminAuthorized = token  ==="sanjeev";
    if(!isAdminAuthorized){
        console.log("User is not authorized"); 
        res.status(401).send("Unauthorized User")       
    }else{
        next();
    }
}

module.exports={adminAuth,userAuth}

