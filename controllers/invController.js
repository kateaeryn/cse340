const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    errors: null,
  })
}
/***********************************
 * Build Individual Detail View
 * *****************************/
invCont.buildDetailById = async function (req, res, next) {
  const inventory_id = req.params.inventoryId
  const data = await invModel.getDetailByInventoryId(inventory_id)
  const grid = await utilities.buildDetailGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].inv_year + ' ' + data[0].inv_make + ' ' + data[0].inv_model
  res.render("./inventory/detail", {
    title: className,
    nav,
    grid,
    errors: null,
  })
}

/***********************************
 * Build Management View
 * *****************************/
invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Management",
    nav,
    errors: null,
  })
}

/***********************************
 * Build New Classification View
 * *****************************/
invCont.buildNewClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/newClassification", {
    title: "New Classification",
    nav,
    errors: null,
  })
}

/***********************************
 * Build New Inventory View
 * *****************************/
invCont.buildNewInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/newInventory", {
    title: "New Inventory",
    nav,
    errors: null,
  })
}


  module.exports = invCont