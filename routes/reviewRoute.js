//Needed Resources
const express = require("express")
const router = new express.Router() 
const revController = require("../controllers/revController")
const utilities = require("../utilities")
const regValidate = require("../utilities/account-validation")

 




//route to edit reviews
router.get("/edit:reviewId", utilities.handleErrors(revController.buildReviewEdit))

module.exports = router