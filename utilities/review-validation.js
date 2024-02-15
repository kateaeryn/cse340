const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}


/*************************************
 * Validate review data
 *********************************/
validate.reviewRules = () => {
  return [
      body("review_text")
        .isLength({ min: 6 })
        .withMessage("Please enter a review."),
    //   body("review_date")
    //     .isDate()
  ]
}

/**************************
 * Check review data
 ***************************/
validate.checkReviewData = async (req, res, next) => {
    const {  review_text, review_id, review_date } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("review/edit", {
            errors,
            title: "Edit your review",
            nav,
            review_text,
            review_id,
            review_date
        })
        return
    } 
       next() 
    
}

module.exports = validate