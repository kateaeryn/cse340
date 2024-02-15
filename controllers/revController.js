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
    const review = await reviewModel.getReviewData(review_id)
    console.log(review[0])
  res.render("review/edit", {
    title: "Edit your review",
    nav,
      errors: null,
      review_date: review[0].review_date,
      review_text: review[0].review_text,
      inv_id: review[0].inv_id,
      account_id: review[0].account_id,
     review_id: review[0].review_id
  })
}

module.exports = revCont