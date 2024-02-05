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
  res.render("inventory/classification", {
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
  res.render("inventory/detail", {
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
  const classificationSelect = await utilities.buildDropDown()
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    classificationSelect,
    errors: null,
  })
}

/***********************************
 * Build New Classification View
 * *****************************/
invCont.buildNewClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "New Classification",
    nav,
    errors: null,
  })
}
/*******************************
 * Add New Classification
 ****************************/
invCont.addClassification = async function (req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body
  const regResult = await invModel.addNewClassification(classification_name) 
  if (regResult) {
    req.flash("notice",
      "You have added a new classification.")
    res.status(201).render("inventory/management", {
      title: "Management",
      nav,
      errors: null,
      })
  } else {
    req.flash("notice", "Sorry, the addition failed.")
    res.status(501).render("inventory/add-classification", {
      title: "New Classification",
      nav,
      errors: null,
    })
  }
}


/***********************************
 * Build New Inventory View
 * *****************************/
invCont.buildNewInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const list = await utilities.buildDropDown()
  res.render("inventory/add-inventory", {
    title: "New Inventory",
    nav,
    list,
    errors: null,
  })
}
/*********************************
 * Add new Inventory to database
 *********************************/
invCont.addInventory = async function (req, res) {
  let nav = await utilities.getNav()
  const id = classification_id
  const list = await utilities.buildDropDown(id)
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
  const regResult = await invModel.addNewInventory(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  ) 
  if (regResult) {
    req.flash("notice",
      "You have added new inventory.")
    res.status(201).render("inventory/management", {
      title: "Management",
      nav,
      errors: null,
      })
  } else {
    req.flash("notice", "Sorry, the addition failed.")
    res.status(501).render("inventory/add-inventory", {
      title: "New Inventory",
      nav,
      list,
      errors: null,
    })
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}


  module.exports = invCont