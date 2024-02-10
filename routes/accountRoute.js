//Needed Resources
const express = require("express")
const router = new express.Router() 
const accController = require("../controllers/accController")
const utilities = require("../utilities")
const regValidate = require("../utilities/account-validation")

//route to the account management view
router.get("/", utilities.checkLogin, utilities.handleErrors(accController.manageAccount))

//Route to get Account Page
router.get("/login", utilities.handleErrors(accController.buildLogin))

//route to get registration page
router.get("/register", utilities.handleErrors(accController.buildRegister))

// route to update account information
router.get("/update", utilities.handleErrors(accController.updateAccount))

//route to post the registration info
router.post("/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accController.registerAccount))

//Process login attempt
router.post("/login",
    regValidate.loginRules(),
    regValidate.checkLogData,
    utilities.handleErrors(accController.accountLogin) )

    //route to update account information
router.post("/update",   
    regValidate.updateRules(),
    //regValidate.checkAccountData,
     utilities.handleErrors(accController.updateAccInfo))

//route to update account information
router.post("/updatePassword",
       //  regValidate.passwordRules(),
         //regValidate.checkPassword,
     utilities.handleErrors(accController.updatePassword))
    
 
//route to log out
router.get("/", utilities.handleErrors(accController.logOut))

module.exports = router;