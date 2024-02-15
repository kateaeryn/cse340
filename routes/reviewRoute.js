//Needed Resources
const express = require("express")
const router = new express.Router() 
const revController = require("../controllers/revController")
const utilities = require("../utilities")
const regValidate = require("../utilities/review-validation")

 
//route to build edit reviews
router.get("/edit/:reviewId", utilities.handleErrors(revController.buildReviewEdit));

//route to update review
router.post("/edit/",
    regValidate.reviewRules(),
    regValidate.checkReviewData,
    utilities.handleErrors(revController.editReview))

//route to build delete view
router.get("/delete/:reviewId", utilities.handleErrors(revController.deleteReviewItem))

//route to delete review
router.post("/delete/", utilities.handleErrors(revController.deleteReviewData))


module.exports = router