const utilities = require("../utilities/")
const baseController = {}


baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  res.render("index", {title: "Home", nav})
}

//Intentional server error controller
//baseController.buildFooter = async function (req, res) {
  //const footer = await utilties.getFooter()
  //res.render("footer", {title: "Footer", footer})
//}

module.exports = baseController