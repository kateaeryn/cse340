// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const revController = require("../controllers/revController")
const utilities = require("../utilities/")
const regValidate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

//Route to build detail page
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildDetailById));


//route to build the management page
router.get("/", utilities.checkAccountType, utilities.handleErrors(invController.buildManagementView));


//route to build the new classification page
router.get("/add-classification", utilities.checkAccountType, utilities.handleErrors(invController.buildNewClassification));

//route to add to the classification table
router.post("/add-classification",
     regValidate.classificationRules(),
     regValidate.checkClassData,
    utilities.handleErrors(invController.addClassification));

//route to build new inventory page
router.get("/add-inventory",  utilities.checkAccountType, utilities.handleErrors(invController.buildNewInventory));

//route to add new inventory to database
router.post("/add-inventory",
     regValidate.inventoryRules(),
     regValidate.checkInvData,
    utilities.handleErrors(invController.addInventory))

//route to fetch inventory list for managing
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

//route to edit inventory item
router.get("/edit/:inv_id",  utilities.checkAccountType, utilities.handleErrors(invController.modifyInventoryItem))

//route to update inventory item
router.post("/update/",
    regValidate.inventoryRules(),
    regValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory))

    //route to delete inventory item view
router.get("/delete/:inv_id", utilities.checkAccountType, utilities.handleErrors(invController.deleteInventoryItem)
)
//route to delete from database
router.post("/delete/",  utilities.checkAccountType, utilities.handleErrors(invController.deleteInventory)
)

//route to log out
router.post("/logout", 
    utilities.handleErrors(invController.logOut))

//route to post reviews
router.post("/review", 
    utilities.handleErrors(revController.submitReview))


module.exports = router;
