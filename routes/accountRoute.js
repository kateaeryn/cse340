//Needed Resources
const express = require("express")
const router = new express.Router() 
const accController = require("../controllers/accController")
const utilities = require("../utilities")

//Route to get Account Page
router.get("/login", utilities.handleErrors(accController.buildLogin))

//route to get registration page
router.get("/register", utilities.handleErrors(accController.buildRegister))

//route to post the registration info
router.post("/register", utilities.handleErrors(accController.registerAccount))

module.exports = router;