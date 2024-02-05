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



module.exports = router;