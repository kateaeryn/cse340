const pool = require("../database/")


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


/* *****************************
* Return review data using account_id
* ***************************** */
async function getReviewByAccountId(account_id) {
  try {
    const result = await pool.query(
      'SELECT inv_year, inv_make, inv_model, review_id, review_date FROM public.inventory FULL JOIN public.review ON public.inventory.inv_id = public.review.inv_id WHERE public.review.account_id = $1',
      [account_id])
    return result.rows
  } catch (error) {
    return new Error(error)
  }
}

/* *****************************
* Return review data for editing
* ***************************** */
async function getReviewByReviewId(review_id) {
  try {
    const result = await pool.query(
      'SELECT review_id, review_date, review_text, inv_id, account_id FROM public.review WHERE public.review.review_id = $1',
      [review_id])
   
    return result.rows
  } catch (error) {
    return new Error(error)
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

/**********************************
 * update review in database
*************************************/
async function updateReview(review_text, review_id) {
  try {
      const sql = "UPDATE public.review SET review_text = $2 WHERE review_id = $1"
      return await pool.query(sql, [review_id, review_text])
  } catch (error) {
    console.log(error.message)
  }
}

/**********************************
 * delete review in database
*************************************/
async function deleteReview(review_id) {
  try {
    const sql = "DELETE FROM public.review WHERE review_id = $1;"
    const data = await pool.query(sql, [review_id])
    console.log(data)
    return data
  } catch (error) {
   new Error("Inventory Deletion Error")
  }
}

module.exports = {getReviewByAccountId, getReviewByReviewId, getReviewByInventoryId, addNewReview, updateReview, deleteReview}