const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()
const accModel = require("../models/account-model")

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid = "" 
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the detail view HTML
* ************************************ */
Util.buildDetailGrid = async function(data) {
  let grid = "" 
  if (data.length > 0) {
    grid = '<div id="detail-display">'
    data.forEach(vehicle => {
      grid += '<img src="' + vehicle.inv_image
        + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
        + ' on CSE Motors" />'
      grid += '<div id="info">'
      grid += '<h2 id="vehicleName">' + vehicle.inv_make + ' ' + vehicle.inv_model + '</h2>'
      grid += '<p id="descriptionTag"> Description: '
      grid += '<span id="description">' + vehicle.inv_description + '</span>'
      grid += '</p>'
      grid += '<p id="priceTag"> Price: '
      grid += '<span id="price">$'
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</p>'
      grid += '<p id="mileTag"> Mileage: '
      grid += '<span id="mileage">' + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + '</span>'
      grid += '</p>'
      grid += '<p id="colorTag"> Color: '
      grid += '<span id="color">' + vehicle.inv_color + '</span>'
      grid += '</p>'
      grid += '</div>'
    })
    grid += '</div>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the detail view HTML
* ************************************ */
Util.buildReviewGrid = async function(review) {
  let list = ""  
  if (review.length > 0) {
    let account = await accModel.getAccountById(review[0].account_id)
    const name = account.account_firstname.charAt(0) + account.account_lastname
    const sorted = review.sort((a, b) => b.review_date - a.review_date) 
    console.log(sorted)
    list = '<ul id="reviewList">'
    sorted.forEach(item => {
      list += '<li>'
      list += name + " wrote on " + item.review_date.toLocaleDateString('en-us', { month: 'long', day:'numeric', year: 'numeric'}) 
      list += '<hr>'
      list += item.review_text   
      list += '</li>'
    })
    list += '</ul>' 
  } else {
    list += '<p id="reviewThis" >Be the first to write a review</p>'
  }
  return list
}


// Build inventory items into HTML table components and inject into DOM 
Util.buildReviewList = async function(review) { 
  // Set up the table labels 
  let dataTable = '<thead>'; 
  if (review.length > 0){
    const sorted = review.sort((a, b) => b.review_date - a.review_date) 
 dataTable += '</thead>'; 
 // Set up the table body 
 dataTable += '<tbody>'; 
 // Iterate over all reviews in the array list them
    sorted.forEach(function (element) { 
    
  dataTable += `<tr><td>Reviewed the ${element.inv_year} ${element.inv_make} ${element.inv_model} on ${element.review_date.toLocaleDateString('en-us', { month: 'long', day:'numeric', year: 'numeric'})}</td>`; 
  dataTable += `<td><a href='/review/edit/${element.review_id}' title='Click to update'>Edit</a></td>`; 
  dataTable += `<td><a href='/review/delete/${element.review_id}' title='Click to delete'>Delete</a></td></tr>`; 
 }) 

dataTable += '</tbody>'; 
  } else {
    dataTable += '<p>You have no reviews</p>'
  }
 return dataTable
 

}


/********************************
 * Build classification drop down menu
 ***********************************/
Util.buildDropDown = async function(selection) {
  let data = await invModel.getClassifications()
  let list 
  list += '<option selected value="">Select A Classification</option>'
  data.rows.forEach((row) => {   
    if (selection == row.classification_id) {
      list += '<option></option>'
      list += '<option value="' + row.classification_id + '" selected="selected">'
      list += row.classification_name
      list += "</option>"
    }
     list += '<option value="' + row.classification_id + '">'
     list += row.classification_name
     list += "</option>"
})
  list += "</select>"
   
  return list
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
 if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   function (err, accountData) {
    if (err) {
     req.flash("Please log in")
     res.clearCookie("jwt")
     return res.redirect("/account/login")
    }
    res.locals.accountData = accountData
    res.locals.loggedin = 1
    next()
   })
 } else {
  next()
 }
}

/* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

/* ****************************************
 *  Check account type
 * ************************************ */
Util.checkAccountType = (req, res, next) => {
  if (res.locals.loggedin) {
    if (res.locals.accountData.account_type == "Admin" || res.locals.accountData.account_type == "Employee") {
      console.log("checked account")
    next()
    } else {
    res.redirect("/")
    }

  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}
 

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util