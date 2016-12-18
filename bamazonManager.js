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
        case "Add to Inventory": 
                            products = []; //empty any previous updated products
                            getInventoryUpdateAmount(); break;
        case "Add New Product": getProductInfo(); break;
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

         //console.log(err);
         displayResults(res);
         mainMenu();
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
    var query = "select * from product "
    query += "order by department_name ASC, product_name ASC";

    //console.log(query);

     connection.query(query, function(err, res){
         if(err){
             throw err;
         }

         //console.log(res);
        displayResults(res);
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
                        if(isNaN(input) || input.length == 0 || parseInt(input) < 0){
                            return "Please enter a valid number >= 0.";
                        }
                        return true;
                    }
                }
        ]).then(tryToUpdateToInventory);
    });    
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
     connection.query(query, whereClause, function(err, result){
         if(err){
             throw err;
         }

         if(result.length != 1){
             console.log(itemId + " does not exist. Please make another selection.");
             getInventoryUpdateAmount();
             return;
         }

       // console.log(product);
        var newStockQuantity = updateAmount + parseInt(result[0].stock_quantity);
        updateQuantity(itemId, newStockQuantity, result);
         //connection.end();
    });
    
}

function updateQuantity(itemId, stockQuantity, result){
    var query = "update product set stock_quantity = " + stockQuantity + " ";
    query += "where item_id = '" + itemId + "'";

     connection.query(query, function(err, res){
         if(err){
             throw err;
         }
        if(res !== null){
            console.log("Item (" + itemId + ") successfully updated");
            var product = new Product();
            product.itemId = itemId;
            product.productName = result[0].product_name;
            product.price = result[0].price;
            product.quantity = stockQuantity;
            product.department = result[0].department_name;
            products.push(product);
            
            showUpdatedProducts();
        }
        else{
            console.log("Unable to update item (" + itemId + ")");
        }
        
        getInventoryUpdateAmount();
        
    });    
}


function getProductInfo(){
    inquirer.prompt([
            {
                    name: "itemId",
                    message: "Enter item ID or (E or e) to end data entry) ",
                    type: "input",
                    validate: function(input){
                        if(input.length == 0){
                            return "Please enter an item ID or (E or e) to stop."
                        }
                        return true;
                    }
            },
            {
                    when: function (response) {
                            return response.itemId.toUpperCase() != 'E';
                        },
                    name: "productName",
                    message: "Enter product name: ",
                    type: "input",
                    validate: function(input){
                        if(input.length == 0){
                            return "Please enter a product name."
                        }
                        return true;
                    }
            },
            {
                    name: "price",
                    message: "Enter the price ",
                    type: "input",
                    validate: function(input){
                        if(input.length == 0 || isNaN(input) || parseFloat(input) <= 0){
                            return "Please enter a value > 0."
                        }
                        return true;
                    }
            },
            {
                    name: "quantity",
                    message: "Enter the quantity in stock ",
                    type: "input",
                    validate: function(input){
                        if(input.length == 0 || isNaN(input) || parseInt(input) <= 0){
                            return "Please enter a value > 0."
                        }
                        return true;
                    }
            },
            {
                    name: "department",
                    message: "Enter the department: ",
                    type: "input",
                    validate: function(input){
                        if(input.length == 0){
                            return "Please enter a department name."
                        }
                        return true;
                    }
            }
    ]).then(addToProductTable);
}

function addToProductTable(data){
    if(data.itemId.toUpperCase() === "E"){
        mainMenu();
        return;
    }

    //see if you already have the item
    var query = "select item_id from product where ?";
    var where = {
        item_id: data.itemId
    };
    connection.query(query, where, function(err, res){
        if(err)
        {
            throw err;
        }

        if(res.length == 1){
            console.log("Item already in database.");
            getProductInfo();
            return;
        }

        query = "insert into product values (?, ?, ?, ?, ?)";
        var values = [data.itemId, data.productName, data.department, parseFloat(data.price).toFixed(2), parseInt(data.quantity)];
        connection.query(query, values, function(err, res){
            if(err) throw err;
            console.log("Item (" + data.itemId + ") successfully added.");
            displayResults(res);
            getProductInfo();
        });
    });
}


function showUpdatedProducts(){
    if(products.length == 0) return;
    console.log("Currently updated:");
    var productTable = new Table({
        head: ['Item ID', 'Product Name', 'Price (USD)', 'Department', 'Stock Quantity'],
        colAligns: ['left', 'left', 'right', 'left', 'right']
    });
//    console.log("here " + productTable);
    for(var i = 0; i < products.length; i++){
        var product = products[i];
        productTable.push([product.itemId, product.productName, product.price.toFixed(2), product.department, product.quantity]);
    }
    console.log(productTable.toString());
//    console.log("here?");
}

// function start(){
//     listProducts();
// }

// start();



mainMenu();