const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const invModel = require("../models/inventory-model")

/**************************
 * New Classification Rules
 ***********************/
validate.classificationRules = () => {
    return [
        body("classification_name")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please enter a classification.")
            .custom(async (classification_name) => {
                const nameExists = await invModel.checkExistingClassification(classification_name)
                if (nameExists) {
                    throw new Error("Classification exists, please create a new Classification.")
                }
            })
    ]
}

/*****************************************
 * Check data and return errors if needed
 *****************************************/
validate.checkClassData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            errors,
            title: "Add Classification",
            nav,
            classification_name,
        })
        return
    }
    next()
}

/**************************
 * New Inventory Rules
 ***********************/
validate.inventoryRules = () => {
    return [
        body("inv_year")
            .isLength({ min: 1 })
            .withMessage("Please enter a year."),
        body("inv_make")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please enter the Make of the vehicle."),
        body("inv_model")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please enter the Model of the vehicle"),
        body("inv_description")
            .isLength({ min: 6 })
            .withMessage("Please enter a description of the vehicle."),
        body("inv_miles")
            .isLength({ min: 1 })
            .withMessage("Please enter mileage for the vehicle."),
        body("inv_color")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please enter a color for the vehicle."),
        body("inv_price")
            .isLength({ min: 1 })
            .withMessage("Please enter a price for the vehicle."),   
        body("classification_id")
            .isLength({ min: 1 })
            .withMessage("Please select a classification for the vehicle.")
        
    ]
}

/**************************
 * Check inventory data
 ***************************/
validate.checkInvData = async (req, res, next) => {
    const { inv_year, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_miles, inv_color, inv_price, classification_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        const id = classification_id
        let list = await utilities.buildDropDown(id)
        res.render("inventory/add-inventory", {
            errors,
            title: "Add Inventory",
            nav,
            list,
            classification_id,
            inv_year,
            inv_make,
            inv_model,
            inv_description,
            inv_miles,
            inv_image,
            inv_thumbnail,
            inv_color,
            inv_price
        })
        return
    }
    
    next()
}


/**************************
 * Check modified data
 ***************************/
validate.checkUpdateData = async (req, res, next) => {
    const { inv_id, inv_year, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_miles, inv_color, inv_price, classification_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        const id = classification_id
        let list = await utilities.buildDropDown(id)
        const itemName = `${inv_make} + ${inv_model}`
        res.render("inventory/edit/", {
            errors,
            title: "Modify" + itemName,
            nav,
            list,
            classification_id,
            inv_year,
            inv_make,
            inv_model,
            inv_description,
            inv_miles,
            inv_image,
            inv_thumbnail,
            inv_color,
            inv_price,
            inv_id
        })
        return
    }
    next()
}

module.exports = validate