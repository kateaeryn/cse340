const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}
/*************************************
 * Get Details about selected vehicle
 *************************************/
async function getDetailByInventoryId(inventory_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
      WHERE i.inv_id = $1`,
      [inventory_id]
    )
    return data.rows
  } catch (error) {
    console.error("getdetailbyinventoryid error" + error)
  }
}

/**********************************
 * Post new classification to database
*************************************/
async function addNewClassification(classification_name) {
  try {
    const sql = "INSERT INTO public.classification(classification_name) VALUES ($1);"
    
    return await pool.query(sql, [classification_name])
  } catch (error) {
    console.log(error.message)
  }
}

/*************************************
 * Check for existsing classifications
 *************************************/
async function checkExistingClassification(classification_name) {
  try {
    const sql = "SELECT * FROM classification WHERE classification_name = $1"
    const name = await pool.query(sql, [classification_name])
    return name.rowCount
  } catch (error) {
    return error.message
  }
}
/**********************************
 * Post new inventory to database
*************************************/
async function addNewInventory(inv_make, inv_model,inv_year,inv_description,inv_image,inv_thumbnail,inv_price,inv_miles,inv_color,classification_id) {
  try {
    const sql = "INSERT INTO public.inventory(inv_make, inv_model,inv_year,inv_description,inv_image,inv_thumbnail,inv_price,inv_miles,inv_color,classification_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10);"
    return await pool.query(sql, [inv_make, inv_model,inv_year,inv_description,inv_image,inv_thumbnail,inv_price,inv_miles,inv_color,classification_id])
  } catch (error) {
    console.log(error.message)
  }
}


/**********************************
 * Update inventory in database
*************************************/
async function updateInventory(inv_id, inv_make, inv_model,inv_year,inv_description,inv_image,inv_thumbnail,inv_price,inv_miles,inv_color,classification_id) {
  try {
    const sql = "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_year = $3, inv_description = $4, inv_image = $5, inv_thumbnail = $6, inv_price =$7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *;"
    const data = await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id, inv_id])
    return data.rows[0]
  } catch (error) {
    console.log("model error: " + error)
  }
}

/**********************************
 * delete inventory in database
*************************************/
async function deleteInventory(inv_id) {
  try {
    const sql = "DELETE FROM public.inventory WHERE inv_id = $1;"
    const data = await pool.query(sql, [inv_id])
    return data
  } catch (error) {
   new Error("Inventory Deletion Error")
  }
}

/**********************************
 * Post new review to database
*************************************/
async function addNewReview(account_id, inv_id, review_text) {
  try {
    const sql = "INSERT INTO public.review(account_id, inv_id, review_text) VALUES ($1,$2,$3);"
    return await pool.query(sql, [account_id, inv_id, review_text])
  } catch (error) {
    console.log(error.message)
  }
}

/*************************************
 * Get reviews about selected vehicle
 *************************************/
async function getReviewByInventoryId(inventory_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.review AS i
      WHERE i.inv_id = $1`,
      [inventory_id]
    )
    return data.rows
  } catch (error) {
    console.error("getdetailbyinventoryid error" + error)
  }
}



module.exports = {
  getClassifications, getInventoryByClassificationId, getDetailByInventoryId, checkExistingClassification,
  addNewClassification, addNewInventory, updateInventory, deleteInventory, addNewReview, getReviewByInventoryId,
}