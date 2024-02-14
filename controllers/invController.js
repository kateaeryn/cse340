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
  const review = await invModel.getReviewByInventoryId(inventory_id)
  let nav = await utilities.getNav()
  let grid = await utilities.buildDetailGrid(data)
  let list = await utilities.buildReviewGrid(review)
  const className = data[0].inv_year + ' ' + data[0].inv_make + ' ' + data[0].inv_model
  res.render("inventory/detail", {
    title: className,
    nav,
    grid,
    list,
    errors: null,
    inv_id: data[0].inv_id,
  })
}

/***********************************
 * Build Management View
 * *****************************/
invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav()
  const list = await utilities.buildDropDown()
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    list,
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
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
  const id = classification_id
  const list = await utilities.buildDropDown(id)
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
    res.redirect("/inv/")
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

 /************************************
  * Modify inventory item
  ***********************************/
 invCont.modifyInventoryItem = async (req, res, next) => {
   const inv_id = parseInt(req.params.inv_id)
   let nav = await utilities.getNav()
   const itemData = await invModel.getDetailByInventoryId(inv_id)
   const selection = parseInt(itemData[0].classification_id)
   const list = await utilities.buildDropDown(selection)
   const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  res.render("inventory/edit", {
    title: "Modify " + itemName,
    nav,
    list: list,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_description: itemData[0].inv_description,
    inv_image: itemData[0].inv_image,
    inv_thumbnail: itemData[0].inv_thumbnail,
    inv_price: itemData[0].inv_price,
    inv_miles: itemData[0].inv_miles,
    inv_color: itemData[0].inv_color,
    classification_id: selection
  })
}

/*********************************
 * Modify Inventory in the database
 *********************************/
invCont.updateInventory = async function (req, res) {
  let nav = await utilities.getNav()
  const { inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,
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
  if (updateResult) {
    const itemName = updateResult.inv_make + " " + inv_model
    req.flash("notice",
      `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildDropDown(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit/" + classification_id, {
      title: "Modify " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id,
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
    })
  }
}

/************************************
  * build delete item view
  ***********************************/
 invCont.deleteInventoryItem = async (req, res, next) => {
   const inv_id = parseInt(req.params.inv_id)
   let nav = await utilities.getNav()
   const itemData = await invModel.getDetailByInventoryId(inv_id)
   const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  res.render("inventory/delete", {
    title: "Delete " + itemName +"?",
    nav,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_price: itemData[0].inv_price,
  })
}

/*********************************
 * Modify Inventory in the database
 *********************************/
invCont.deleteInventory = async function (req, res) {
  let nav = await utilities.getNav()
  const inv_id = parseInt(req.body.inv_id)
  const deleteResult = await invModel.deleteInventory(inv_id) 
  if (deleteResult) {
    req.flash("notice",
      "The vehicle was successfully deleted.")
    res.redirect("/inv/")
  } else {
    req.flash("notice", "Sorry, the deletion failed.")
    res.redirect("inventory/delete/")
  }
}

/* ****************************************
*  Deliver logout
* *************************************** */
invCont.logOut = async function (req, res) {
  res.clearCookie("jwt")
  res.locals.loggedin = 0
  req.flash("You are logged out.")
  res.redirect("/")
        }


/*******************************
 * Add New review
 ****************************/
invCont.submitReview = async function (req, res) {
  let nav = await utilities.getNav()
  const { account_id, inv_id, review_text } = req.body
  const inventory_id = inv_id
  const review = await invModel.getReviewByInventoryId(inventory_id)
  const data = await invModel.getDetailByInventoryId(inventory_id)
  let grid = await utilities.buildDetailGrid(data)
  let list = await utilities.buildReviewGrid(review)
  const regResult = await invModel.addNewReview(account_id, inv_id, review_text) 
  const className = data[0].inv_year + ' ' + data[0].inv_make + ' ' + data[0].inv_model
  if (regResult) {
    res.status(201).render("inventory/detail", {
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



  module.exports = invCont