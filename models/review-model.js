const pool = require("../database/")




/* *****************************
* Return review data using account_id
* ***************************** */
async function getReviewById(account_id) {
  try {
    const result = await pool.query(
      'SELECT inv_year, inv_make, inv_model, review_id, review_date FROM public.inventory FULL JOIN public.review ON public.inventory.inv_id = public.review.inv_id WHERE public.review.account_id = $1',
      [account_id])
    console.log(result)
    return result.rows
  } catch (error) {
    return new Error(error)
  }
}

module.exports = {getReviewById}