//Needed Resources
const express = require("express")
const router = new express.Router() 
const accController = require("../controllers/accController")
const utilities = require("../utilities")
const regValidate = require("../utilities/account-validation")

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
router.post("/login", (req, res) => {
     regValidate.loginRules(),
         regValidate.checkLogData,
    res.status(200).send('login process')
})

module.exports = router;