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

	// connection.end();

});