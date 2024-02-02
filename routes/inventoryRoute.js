// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const regValidate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

//Route to build detail page
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildDetailById));

//route to build the management page
router.get("", utilities.handleErrors(invController.buildManagementView));

//route to build the new classification page
router.get("/add-classification", utilities.handleErrors(invController.buildNewClassification));

//route to add to the classification table
router.post("/add-classification",
     regValidate.classificationRules(),
     regValidate.checkClassData,
    utilities.handleErrors(invController.addClassification));

//route to build new inventory page
router.get("/add-inventory", utilities.handleErrors(invController.buildNewInventory));

//route to add new inventory to database
router.post("/add-inventory",
     regValidate.inventoryRules(),
     regValidate.checkInvData,
    utilities.handleErrors(invController.addInventory))

module.exports = router;
