
const data = accModel.getReviewById(accountId);
buildReviewList(data);


 // Build inventory items into HTML table components and inject into DOM 
function buildReviewList(data) { 
 let reviewTable = document.getElementById("reviewTable"); 
    // Set up the table labels 
 let dataTable = '<thead>'; 
 dataTable += '<tr><th>Customer Reviews</th><td>&nbsp;</td><td>&nbsp;</td></tr>'; 
 dataTable += '</thead>'; 
 // Set up the table body 
 dataTable += '<tbody>'; 
 // Iterate over all reviews in the array list them
    data.forEach(function (element) { 
     console.log(element)
  dataTable += `<tr><td>${element} ${element}</td>`; 
  dataTable += `<td><a href='/inv/edit/${element.review_id}' title='Click to update'>Modify</a></td>`; 
  dataTable += `<td><a href='/inv/delete/${element.review_id}' title='Click to delete'>Delete</a></td></tr>`; 
 }) 
 dataTable += '</tbody>'; 
 // Display the contents in the Inventory Management view 
 reviewTable.innerHTML = dataTable; 
}
