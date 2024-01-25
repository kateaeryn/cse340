//Needed Resources
const express = require("express")
const router = new express.Router() 
const accController = require("../controllers/accController")
const utilities = require("../utilities")

//Route to get Account Page
router.get("/login", utilities.handleErrors(accController.buildLogin))

module.exports = router;