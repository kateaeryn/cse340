const utilities = require("../utilities/")
const reviewModel = require("../models/review-model")
const revCont = {}
require("dotenv").config()



/* ****************************************
*  Deliver review editing view
* *************************************** */
revCont.buildReviewEdit = async function (req, res, next) {
  let nav = await utilities.getNav()
  const review_id = req.params.reviewId
  let review = await reviewModel.getReviewById(res.locals.accountData.account_id)
  res.render("account/edit", {
    title: "Edit your Reviews",
    nav,
    errors: null,
  })
}

module.exports = revCont