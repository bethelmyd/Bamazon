"use strict";

var mysql = require("mysql");
var Table = require("cli-table");
var inquirer = require("inquirer");

//var ourTable = new Table();

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});

connection.connect(function (err) {
  if (err) throw err;
  //console.log("connected as id " + connection.threadId);
});


function promptUser()
{
    inquirer.prompt([
           {
                name: "itemId",
                message: "Which item would you like to buy? (C - cancel) ",
                type: "input",
                validate: function(input){
                    if(input.length == 0){
                        return "Please make a selection."
                    }
                    return true;
                }
            },
            {
                when: function (response) {
                        return response.itemId.toUpperCase() != 'C';
                    },
                name: "quantity",
                message: "Enter the quantity: ",
                type: "input",
                validate: function(input){
                    if(isNaN(input) || input.length == 0 || parseInt(input) < 0){
                        return "Please enter a valid number >= 0.";
                    }
                    return true;
                }
            }
    ]).then(processPurchase);
}

function processPurchase(selection){
    var itemId = selection.itemId;
    if(itemId.toUpperCase() === 'C'){
        connection.end();
        process.exit(0);
    }
    var quantity = parseInt(selection.quantity);
    //see if item is in database
    var query = "select item_id, stock_quantity from product where ?";
    var whereClause = {
        item_id: itemId
    };
     connection.query(query, whereClause, function(err, res){
         if(err){
             throw err;
         }

         if(res.length != 1){
             console.log(itemId + " does not exist. Please make another selection.");
             listProducts();
             return;
         }
         tryToFillOrder(itemId, quantity, res);
         //connection.end();
    });
    
 }

function listProducts()
{
    var query = "select item_id, product_name, price, department_name from product where stock_quantity > 0 "
    query += "order by department_name ASC, product_name ASC";

    //console.log(query);

     connection.query(query, function(err, res){
         if(err){
             throw err;
         }

         //console.log(res);
         displayResults(res);
         promptUser();
    });
}

function displayResults(results){
    //console.log(results);
    var ourTable = new Table({
        head: ['Item ID', 'Product Name', 'Price (USD)', 'Department'],
        colAligns: ['left', 'left', 'right', 'left']
    });
    for(var i = 0; i < results.length; i++){
        var record = results[i];
       // console.log(JSON.parse(JSON.stringify(record)));
        ourTable.push([record.item_id, record.product_name, record.price.toFixed(2), record.department_name]);
    }
    console.log(ourTable.toString());
};

function tryToFillOrder(itemId, quantity, result){
    var stockQuantity = parseInt(result[0].stock_quantity);
 //   console.log(quantity + " " + stockQuantity);
    if(quantity > stockQuantity)
    {
        console.log("Cannot supply more than " + stockQuantity);
        promptUser();
        return;
    }
    console.log("Thanks for your order.");
    stockQuantity -= quantity;
 //   console.log(itemId + " " + stockQuantity);
    updateQuantity(itemId, stockQuantity);
}

function updateQuantity(itemId, stockQuantity){
    var query = "update product set stock_quantity = " + stockQuantity + " ";
    query += "where item_id = '" + itemId + "'";

     connection.query(query, function(err, res){
         if(err){
             throw err;
         }

         //console.log(res);
         listProducts();
    });    
}

function start(){
    listProducts();
}

start();



//connection.end();