var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");
var saleItems = []

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
user: "root",

password: "",
database: "bamazon_db"
});

connection.connect(function(err){
	if(err) throw err;
	console.log("connection as id " + connection.threadId);

	connection.end();

});

var shop = function () {
  connection.query("SELECT * FROM products", function(err, res) {
		if (err) throw err;
		for (var i = 0; i < res.length; i++){
			saleItems.push({
				ID: res[i].item_id, 
				Product: res[i].product_name, 
				Department: res[i].department_name, 
				Price: res[i].price, 
				Quantity: res[i].stock_quantity
			});
		}//end of for loop
		console.table(saleItems);
		// console.log(saleItems);
	inquirer.prompt([{
		type: "input",
		name: "id",
		message: "What would you like to order?"
	}]).then(function(userPick) {
		console.log("userpick " + userPick.id);
		// console.log(res);
		for (var i = 0; i < res.length; i++) {
			var productItem = res[i];
			console.log(productItem.item_id);

			if (res[i].item_id === userPick.id) {
				inquirer.prompt({
					type: "input",
					name: "units",
					message: "How many would you like to purchase?"
				}).then(function(inventory) {
					if (productItem.stock_quantity > parseInt(inventory.units)) {
						var newQuantity = (productItem.stock_quantity - parseInt(inventory.units));
						connection.query("UPDATE products SET ? WHERE ?", [{
							//need to subtract
							stock_quantity: newQuantity
						}, {
							item_id: productItem.id
						}], function (err, res) {
							console.table(saleItems);
						});
						shop();
					}//end of if
					else {
						console.log("Insufficient Quantity")
						shop();
					}

				});//end of inventory fn
			// else {}
			} //end of if
		console.log("test");
		}//end of for loop
	});
  });//end of connection.query for products in db
};//end of shop function

shop();