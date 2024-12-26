const validator = require("validator");
//signup
/**
 * Validates user input during signup.
 * - Ensures `firstName` and `lastName` are provided.
 * - Ensures `emailId` is a valid email.
 * - Ensures `password` meets strength requirements.
 */
const signupValidation = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password");
  }
};

/**
 * Validates fields allowed for profile editing.
 * - Checks if all keys in `req.body` exist in the `allowedEditFields` array.
 * - Returns `true` if validation passes, otherwise `false`.
 */
const validateEditProfileData = function (req) {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "emailId",
    "age",
    "gender",
    "about",
    "skills",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  ); // Validate each field against allowed fields

  return isEditAllowed;
};

//password change

const validEditedPassword = function(req){
  const allowToPasswordChange = [   
    "password"
  ];

  const isPasswordAllowed = Object.keys(req.body).every((fields)=> validEditedPassword.includes(fields));
  return isPasswordAllowed;
}

module.exports = { signupValidation,validateEditProfileData,validEditedPassword };
