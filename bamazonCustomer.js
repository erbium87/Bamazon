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
	// if(err) throw err;
	console.log("connection as id " + connection.threadId);
});

var shop = function () {
  connection.query("SELECT * FROM products", function(err, res) {
		// if (err) throw err;
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
	inquirer.prompt([{
		type: "input",
		name: "id",
		message: "What would you like to order?"
	}]).then(function(userPick) {
		for (var i = 0; i < res.length; i++) {
			var productItem = res[i];
			// console.log(productItem.item_id);
			if (productItem.item_id === parseInt(userPick.id)) {
				var stock = productItem.stock_quantity;
				var itemID = productItem.item_id;
				var itemCost = parseFloat(productItem.price);
				// console.log("Stock " + stock);
				// console.log("Cost " + itemCost);
				inquirer.prompt({
					type: "input",
					name: "units",
					message: `How many ${productItem.product_name}'s would you like to purchase?`
				}).then(function(inventory) {
					// console.log(stock);
					// console.log("Number wanted: " + inventory.units);
					if (parseInt(stock) >= parseInt(inventory.units)) {
						var newQuantity = (stock - parseInt(inventory.units));
						var totalCost = (parseFloat(inventory.units) * parseFloat(itemCost)).toFixed(2);
						// console.log("New Quantity: " + newQuantity);
						// console.log("ID of product wanted: " + itemID);
						console.log("Total Cost: $" + totalCost);
						connection.query("UPDATE products SET ? WHERE ?", [{
							//need to subtract
							stock_quantity: newQuantity
						}, {
							item_id: itemID
						}], function (err, res){});
						//end of updating db
						inquirer.prompt([{
						type: "confirm",
						name: "id",
						message: "Would you like to order more?"
						}]).then(function(continueShop) {
							if (continueShop.id === true ) {
								saleItems = [];
								shop();
							} else {
								console.log("Have a Nice Day!!");
								connection.end();
							}
						});
					} else {
						console.log("Insufficient Quantity!!!");
						connection.end();
					}
				});//end of inventory fn
			} //end of if
		}//end of for loop
	});//end of userPick
  });//end of connection.query for products in db
};//end of shop function

shop();


