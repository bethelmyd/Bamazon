"use strict";

var mysql = require("mysql");
var Table = require("cli-table");
var inquirer = require("inquirer");
var Product = require("./product.js");

/* Globals */
var cart = [];
/**************************/

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
                message: "Which item would you like to buy? (E or e - exit) ",
                type: "input",
                validate: function(input){
                    if(input.length == 0){
                        return "Please enter an item ID or (E or e) to exit."
                    }
                    return true;
                }
            },
            {
                when: function (response) {
                        return response.itemId.toUpperCase() != 'E';
                    },
                name: "quantity",
                message: "Enter the quantity: ",
                type: "input",
                validate: function(input){
                    if(isNaN(input) || input.length == 0 || parseInt(input) < 1){
                        return "Please enter a valid number >= 0.";
                    }
                    return true;
                }
            }
    ]).then(processPurchase);
}

function processPurchase(selection){
    var itemId = selection.itemId;
    if(itemId.toUpperCase() === 'E'){
        showCart();
        connection.end();
        process.exit(0);
    }
    var quantity = parseInt(selection.quantity);
    //see if item is in database
    var query = "select * from product where ?"; //"select item_id, stock_quantity from product where ?";
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
    console.log("Item added to cart.");
    var cartItem = new Product();
    cartItem.productName = result[0].product_name;
    cartItem.price = result[0].price;
    cartItem.quantity = quantity;
    cartItem.cost = quantity * cartItem.price;
    cart.push(cartItem);

    stockQuantity -= quantity;
 //   console.log(itemId + " " + stockQuantity);
    showCart();
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

function showCart(){
    if(cart.length == 0) return;
    console.log("Your current cart:");
    var total = 0;
    var cartTable = new Table({
        head: ['Product Name', 'Price (USD)', 'Quantity', 'Cost'],
        colAligns: ['left', 'right', 'right', 'right']
    });
    for(var i = 0; i < cart.length; i++){
        var cartItem = cart[i];
        total += cartItem.cost;
       // console.log(JSON.parse(JSON.stringify(record)));
        cartTable.push([cartItem.productName, cartItem.price.toFixed(2), cartItem.quantity, cartItem.cost.toFixed(2)]);
    }
    
    cartTable.push(["", "", "Total", total.toFixed(2)]);
    console.log(cartTable.toString());
}

function start(){
    listProducts();
}

start();



//connection.end();