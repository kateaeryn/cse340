const utilities = require("../utilities/")
const revModel = require("../models/review-model")
const invModel = require("../models/inventory-model")
const revCont = {}
require("dotenv").config()



/* ****************************************
*  Deliver review editing view
* *************************************** */
revCont.buildReviewEdit = async function (req, res, next) {
  let nav = await utilities.getNav()
  const review_id = req.params.reviewId
    const review = await revModel.getReviewByReviewId(review_id)
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

/*******************************
 * Add New review
 ****************************/
revCont.submitReview = async function (req, res) {
  let nav = await utilities.getNav()
  const { account_id, inv_id, review_text } = req.body
  const inventory_id = inv_id
  const regResult = await revModel.addNewReview(account_id, inv_id, review_text) 
  const review = await revModel.getReviewByInventoryId(inventory_id)
  const data = await invModel.getDetailByInventoryId(inventory_id)
  let grid = await utilities.buildDetailGrid(data)
  let list = await utilities.buildReviewGrid(review)
  const className = data[0].inv_year + ' ' + data[0].inv_make + ' ' + data[0].inv_model
  if (regResult) {
    res.status(201).render("inventory/detail" , {
    title: className,
      nav,
      grid,
    list,
    inv_id: data[0].inv_id,
    errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the addition failed.")
    res.status(501).render("inventory/detail", {
      title: className,
    nav,
    grid,
    list,
    inv_id: data[0].inv_id,
    errors: null,
    })
  }
}

/*********************************
 * Modify review in the database
 *********************************/
revCont.editReview = async function (req, res) {
  let nav = await utilities.getNav()
  const { inv_id, account_id, review_text, review_id, review_date } = req.body
  const updateResult = await revModel.updateReview(
    review_text,
   review_id
    ) 
    console.log(updateResult)
  if (updateResult) {
    req.flash("notice",
      `The review was successfully updated.`)
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("review/edit", {
      title: "Edit your review",
      nav,
      errors: null,
      inv_id,
        account_id,
        review_text,
        review_id,
        review_date
    })
  }
}

/************************************
  * build delete review view
  ***********************************/
 revCont.deleteReviewItem = async (req, res, next) => {
   const review_id = req.params.reviewId
   let nav = await utilities.getNav()
   const review = await revModel.getReviewByReviewId(review_id)
   res.render("review/delete", {
     title: "Delete review?",
     nav,
     errors: null,
     review_date: review[0].review_date,
      review_text: review[0].review_text,
      inv_id: review[0].inv_id,
      account_id: review[0].account_id,
     review_id: review[0].review_id
   })
}

/*********************************
 * delete review in the database
 *********************************/
revCont.deleteReviewData = async function (req, res) {
  const review_id = req.body.review_id
  console.log(review_id)
  const deleteResult = await revModel.deleteReview(review_id) 
  if (deleteResult) {
    req.flash("notice",
      "The review was successfully deleted.")
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the deletion failed.")
    res.redirect("review/delete" )
  }
}

module.exports = revCont