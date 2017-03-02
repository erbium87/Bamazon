var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");
var saleItems = [];
var lowItems = [];

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

var managerView = function() {
  inquirer.prompt({
    name: "menuOptions",
    type: "rawlist",
    message: "What would you like to view?",
    choices: ["Products for Sale", "Low Inventory", "Add Inventory", "Add a New Product"]
  }).then(function(answer) {
    if (answer.menuOptions === "Products for Sale") {
      inventory();
    }
    else if (answer.menuOptions === "Low Inventory") {
      lowInventory();
    }
    else if (answer.menuOptions === "Add Inventory") {
    	addInventory();
    }
    else if (answer.menuOptions === "Add a New Product") {
    	addProduct();
    }
  });
};

var inventory = function () {
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
        type: "confirm",
        name: "id",
        message: "Would you like to keep working?"
        }]).then(function(continueShop) {
            if (continueShop.id === true ) {
                saleItems = [];
                managerView();
            } else {
                console.log("Another penny earned! Good job today!");
                connection.end();
            }
        });            
});
};

var lowInventory = function () {
      connection.query("SELECT * FROM products", function(err, res) {
        // if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            if (res[i].stock_quantity <= 5) {
                lowItems.push({
                    ID: res[i].item_id, 
                    Product: res[i].product_name, 
                    Department: res[i].department_name, 
                    Price: res[i].price, 
                    Quantity: res[i].stock_quantity
                });
            }
        }
        console.log("The following items are running low: ");
        console.table(lowItems);
        inquirer.prompt([{
            type: "confirm",
            name: "id",
            message: "Would you like to keep working?"
            }]).then(function(continueShop) {
                if (continueShop.id === true ) {
                    lowItems = [];
                    managerView();
                } else {
                    console.log("Another penny earned! Good job today!");
                    connection.end();
                }
            });
      });
};

var addInventory = function () {
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
        message: "What product would you like to add to?"
    }]).then(function(user) {
        
        for (var i = 0; i < res.length; i++) {
            var productItem = res[i];
            if (productItem.item_id === parseInt(user.id)) {
                var stock = productItem.stock_quantity;
                var itemID = productItem.item_id;
                var productName = productItem.product_name;
                inquirer.prompt({
                    type: "input",
                    name: "units",
                    message: `How many ${productItem.product_name}'s would you like to add to the stock quantity?`
                }).then(function(addStock) {
                    var newQuantity = (stock + parseInt(addStock.units));
                  
                    connection.query("UPDATE products SET ? WHERE ?", [{
                        stock_quantity: newQuantity
                    }, {
                        item_id: itemID
                    }], function (err, res){
                        console.log(productName);
                        if (addStock.units <= 1){
                        console.log(`${addStock.units} unit of ${productName} has been added!`);
                        } else {
                            console.log(`${addStock.units} units of ${productItem.product_name} have been added!`);
                        }
            
                        inquirer.prompt([{
                        type: "confirm",
                        name: "id",
                        message: "Would you like to keep working?"
                        }]).then(function(continueShop) {
                            if (continueShop.id === true ) {
                                saleItems = [];
                                managerView();
                            } else {
                                console.log("Another penny earned! Good job today!");
                                connection.end();
                            }
                        }); //end of continueShop
                        });          
                });//end of addStock fn
            } //end of if
        }//end of for loop
    });//end of user
  });//end of connection.query for products in db
};

var addProduct = function() {
	inquirer.prompt([{
    	name: "product",
    	type: "input",
    	message: "What is the name of the product?"
	}, {
    	name: "department",
    	type: "input",
    	message: "What is the department?"
	}, {
    	name: "price",
    	type: "input",
    	message: "What is the selling price?",
    	validate: function(value) {
    		if (isNaN(value) === false) {
    			return true;
    		} return false;
    	}
	},{
    	name: "stock",
    	type: "input",
    	message: "How many would you like to add?",
    	validate: function(value) {
    		if (isNaN(value) === false) {
    			return true;
    		} return false;
    	}
	}]).then(function(productPush){
		// console.log("blah!");
		connection.query("INSERT INTO products SET ?", {
			product_name: productPush.product,
			department_name: productPush.department,
			price: productPush. price,
			stock_quantity: productPush.stock
		}, function (err, res) {
			console.log(`Your ${productPush.product} has been added!`);
			// managerView();
            inquirer.prompt([{
                type: "confirm",
                name: "id",
                message: "Would you like to keep working?"
                }]).then(function(continueShop) {
                    if (continueShop.id === true ) {
                        saleItems = [];
                        managerView();
                    } else {
                        console.log("Another penny earned! Good job today!");
                        connection.end();
                    }
                });
        });
	});//end of productPUsh
};//end of addProduct

managerView();