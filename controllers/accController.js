const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const accCont = {}
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const reviewModel = require("../models/review-model")

/* ****************************************
*  Deliver login view
* *************************************** */
accCont.buildLogin = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}

/*************************************
 * Deliver registration view
 ********************************/
accCont.buildRegister = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}



/* ****************************************
*  Process Registration
* *************************************** */
accCont.registerAccount = async function(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body
// Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )
  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
accCont.accountLogin = async function(req, res) {
 let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
  req.flash("notice", "Please check your credentials and try again.")
  res.status(400).render("account/login", {
   title: "Login",
   nav,
   errors: null,
   account_email,
  })
 return
 }
  try {
  const passTest = await bcrypt.compare(account_password, accountData.account_password) 
    if (passTest) {
      delete accountData.account_password
  const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
  res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
  return res.redirect("/account/")
    } else {
    req.flash("notice", "Please check your credentials and try again.")
  res.status(400).render("account/login", {
   title: "Login",
   nav,
   errors: null,
   account_email,
  })
} } catch (error) {
  return new Error('Access Forbidden')
 }
}


/* ****************************************
*  Deliver account management view
* *************************************** */
accCont.manageAccount = async function (req, res, next) {
  let nav = await utilities.getNav()
  let review = await reviewModel.getReviewById(res.locals.accountData.account_id)
  console.log(review)
  let dataTable = await utilities.buildReviewList( review)
  res.render("account/accManagement", {
    title: "My Account",
    nav,
    dataTable,
    errors: null,
  })
}

/* ****************************************
*  Deliver account update view
* *************************************** */
accCont.updateAccount = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/update", {
    title: "Update Account",
    nav,
    errors: null,
  })
}

/*******************************
 * Update Account
 ****************************/
accCont.updateAccInfo = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_id } = req.body
  const before = await accountModel.getAccountById(account_id)
  const regResult = await accountModel.editAccountInfo(account_firstname, account_lastname, account_email, account_id) 
  if (regResult) {
    const accountData = await accountModel.getAccountById(account_id)
    const accessToken = jwt.sign(accountData , process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
    res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000, overwrite: true })
    res.locals.accountData = accountData
    req.flash("notice",
      "You have updated your information.")    
    if (before.account_firstname != accountData.account_firstname) {
      req.flash("notice", `First Name: ${accountData.account_firstname} Updated`)
    } 
    if (before.account_lastname != accountData.account_lastname) {
      req.flash("notice", `Last Name: ${accountData.account_lastname} Updated`)
    } 
    if (before.account_email != accountData.account_email) {
      req.flash("notice", `Email: ${accountData.account_email} Updated`)
    } 
   res.redirect("/account/")

  } else {
    req.flash("notice", "Sorry, update failed.")
    res.status(501).render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
    })
  }

}

/*******************************
 * Update Password
 ****************************/
accCont.updatePassword = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { account_password, account_id } = req.body
// Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error changing your password.')
    res.status(500).render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.changePassword(account_id,
    hashedPassword 
  )
  if (regResult) {
    req.flash(
      "notice",
      "You have successfully updated your password."
    )
    res.status(201).render("account/accManagement", {
      title: "Account Management",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the password change failed.")
    res.status(501).render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
*  Deliver logout
* *************************************** */
accCont.logOut = async function (req, res) {
  res.clearCookie("jwt")
  res.locals.loggedin = 0
  req.flash("You are logged out.")
  res.redirect("/")
        }
      


module.exports = accCont