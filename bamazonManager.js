"use strict";

var mysql = require("mysql");
var Table = require("cli-table");
var inquirer = require("inquirer");
var Product = require("./product.js");

/* Globals */
var products = [];
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


function mainMenu()
{
    inquirer.prompt([
        {
            name:"choice",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"],
            type: "list",
            message: "Please make a choice:"

        }
    ]).then(processSelection);
}

function processSelection(whatToDo){

    //console.log(whatToDo.choice);

    switch(whatToDo.choice){
        case "View Products for Sale": listProducts("1 = 1"); break;
        case "View Low Inventory": getInventoryCutOff(); break;
        case "Add to Inventory": getInventoryUpdateAmount(); break;
        case "Add New Product": addNewProduct(); break;
        case "Exit":         
                    console.log("Bye!");
                    connection.end();
                    process.exit(0);
    }
}

function listProducts(whereClause)
{
    var query = "select item_id, product_name, price, department_name, stock_quantity from product where "
    query += whereClause + " ";
    query += "order by department_name ASC, product_name ASC";

    //console.log(query);

     connection.query(query, whereClause, function(err, res){
         if(err){
             throw err;
         }

         //console.log(res);
         displayResults(res);
    });
}

function displayResults(results){
    //console.log(results);
    var ourTable = new Table({
        head: ['Item ID', 'Product Name', 'Price (USD)', 'Department', 'Quantity'],
        colAligns: ['left', 'left', 'right', 'left', 'right']
    });
    for(var i = 0; i < results.length; i++){
        var record = results[i];
       // console.log(JSON.parse(JSON.stringify(record)));
        ourTable.push([record.item_id, record.product_name, record.price.toFixed(2), record.department_name,
                            record.stock_quantity]);
    }
    console.log(ourTable.toString());
    mainMenu();
};

function getInventoryCutOff(){
    inquirer.prompt([
            {
                name: "cutoff",
                message: "Enter the inventory cutoff: ",
                type: "input",
                validate: function(input){
                    if(isNaN(input) || input.length == 0 || parseInt(input) < 5){
                        return "Please enter a valid number >= 5.";
                    }
                    return true;
                }
            }
    ]).then(viewLowInventory);
    
}

function viewLowInventory(cutoffInput){
    listProducts("stock_quantity < " + cutoffInput.cutoff);
}

function getInventoryUpdateAmount(){
    inquirer.prompt([
           {
                name: "itemId",
                message: "Which item would you like to update? (E or e - exit) ",
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
                name: "updateAmount",
                message: "Enter the amount to update: ",
                type: "input",
                validate: function(input){
                    if(isNaN(input) || input.length == 0 || parseInt(input) < 5){
                        return "Please enter a valid number >= 5.";
                    }
                    return true;
                }
            }
    ]).then(tryToUpdateToInventory);
    
}

function tryToUpdateToInventory(updateInput){
    var itemId = updateInput.itemId;
    if(itemId.toUpperCase() == 'E')
    {
        mainMenu();
        return;
    }

    var updateAmount = parseInt(updateInput.updateAmount);
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
             getInventoryUpdateAmount();
             return;
         }

         var newStockQuantity = updateAmount + parseInt(res[0].stock_quantity);
         updateQuantity(itemId, newStockQuantity);
         //connection.end();
    });
    
}

function updateQuantity(itemId, stockQuantity){
    var query = "update product set stock_quantity = " + stockQuantity + " ";
    query += "where item_id = '" + itemId + "'";

     connection.query(query, function(err, res){
         if(err){
             throw err;
         }

         //console.log(res);
        getInventoryUpdateAmount();
    });    
}


function addNewProduct(){
    mainMenu();
}


function showUpdatedProducts(){
    if(products.length == 0) return;
    console.log("Currently updated:");
    var total = 0;
    var cartTable = new Table({
        head: ['Product Name', 'Price (USD)', 'Quantity', 'Cost'],
        colAligns: ['left', 'right', 'right', 'right']
    });
    for(var i = 0; i < cart.length; i++){
        var cartItem = cart[i];
        total += cartItem.cost;
       // console.log(JSON.parse(JSON.stringify(record)));
        cartTable.push([cartItem.product_name, cartItem.price.toFixed(2), cartItem.quantity, cartItem.cost.toFixed(2)]);
    }
    
    cartTable.push(["", "", "Total", total.toFixed(2)]);
    console.log(cartTable.toString());
}

// function start(){
//     listProducts();
// }

// start();



mainMenu();