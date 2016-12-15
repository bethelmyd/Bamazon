"use strict";

var mysql = require("mysql");
var Table = require("easy-table");
var inquirer = require("inquirer");

var ourTable = new Table();

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

function queryDatabase(query, whereClause)
{

    //console.log(query);

     connection.query(query, whereClause, function(err, res){
         if(err){
             throw err;
         }

         //console.log(res);
         displayResult(res);
    });
}

var displayResult =  function(results){
    //console.log(results);
    for(var i = 0; i < results.length; i++){
        var record = results[i];
        ourTable.cell("Item ID", record.item_id);
        ourTable.cell("Product Name", record.product_name);
       // ourTable.cell("Department", record.department_name);
        ourTable.cell("Price (USD)", record.price, Table.number(2));
        //ourTable.cell("Quantity in Stock", record.stock_quantity);
        ourTable.newRow();
    }
    console.log(ourTable.toString());
};

var department = "";
var whereClause = {
    //department_name: department
};

var query = "select item_id, product_name, price from product";

queryDatabase(query, whereClause);




connection.end();