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
                message: "Which item would you like to buy? ",
                type: "input",
                validate: function(input){
                    if(input.length == 0){
                        return "Please make a selection."
                    }
                    return true;
                }
            },
            {
                name: "quantity",
                message: "Enter the quantity: ",
                type: "input",
                validate: function(input){
                    if(isNaN(input) || input.length == 0 || parseInt(input) < 0){
                        return "Please enter a valid number > 0.";
                    }
                    return true;
                }
            }
    ]).then(processSelection);
}

function processSelection(selection){
    
 }

function listProducts()
{
    var query = "select item_id, product_name, price from product";

    //console.log(query);

     connection.query(query, function(err, res){
         if(err){
             throw err;
         }

         console.log(res);
         displayResults(res);
         promptUser();
    });
}

var displayResults =  function(results){
    //console.log(results);
    var ourTable = new Table({
        head: ['Item ID', 'Product Name', 'Price (USD)'],
        colAligns: ['left', 'left', 'right']
    });
    for(var i = 0; i < results.length; i++){
        var record = results[i];
       // console.log(JSON.parse(JSON.stringify(record)));
        ourTable.push([record.item_id, record.product_name, record.price.toFixed(2)]);
    }
    console.log(ourTable.toString());
};

// var department = "";
// var whereClause = {
//     //department_name: department
// };

function start(){
    listProducts();
}

start();



connection.end();