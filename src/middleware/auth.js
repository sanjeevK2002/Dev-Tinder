const User = require("../models/user");
const jwt = require("jsonwebtoken")

/**
 * Middleware to authenticate a user using a JWT token.
 * - Extracts the token from cookies.
 * - Verifies the token and decodes the user ID.
 * - Fetches the user from the database and attaches it to the `req` object.
 * - Calls `next()` to pass control to the next middleware/route handler.
 */

const userAuth=async (req,res,next)=>{
    try {
        const { token } = req.cookies; // Extract token from cookies
        if (!token) {
          res.status(401).send("Token is not valid!!!");
          return; // Stop further execution if no token
        }
        ////  verifies the JWT's signature and decodes its payload to ensure it is valid and not tampered with, using the provided secret key.
        const decodeObj = await jwt.verify(token, "DEV@Tinder7098"); // Verify token
        const { _id } = decodeObj; // Extract user ID from token payload
        const user = await User.findById(_id); // Fetch user from database
        if (!user) {
          res.status(404).send("User not found");
          return; // Stop further execution if user not found
        }
         req.user=user;  // whatever the user got , it just attached to object of req
         
         next();

    }catch(err){
        if (!res.headersSent) {
            res.status(400).send("ERROR :- " + err.message);
          }
    }
}

module.exports={userAuth}

