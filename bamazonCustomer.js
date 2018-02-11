mysql = require("mysql");
_ = require('underscore');
chalk = require("chalk");
const cTable = require('console.table');
let inquirer = require('inquirer');

connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    database: "bamazon"
});


displayProducts = function() {
    connection.connect(function(error) {
        if (error) throw error;
        process.stdout.write('\x1Bc');
        connection.query('select * from bamazon.products', function(error, results, fields) {
            if (error) throw error;
            console.table(results);
            promptCustomer();
        })
    });
}

connectionEnd = function() {
    connection.end();
}


promptCustomer = function() {
    inquirer.prompt([{
            type: "input",
            message: "Enter the Item No you wish to buy",
            name: "buyItem"
        },
        {
            type: "input",
            message: "Enter the quantity",
            name: "ItemQuantity"
        }
    ]).then(function(inquirerResponse) {

        //Check if item number is valid and has the required quantity !

        connection.query('select IFNULL(SUM(stock_quantity),0) stock_quantity, price from bamazon.products where ?', [{
            item_id: inquirerResponse.buyItem
        }], function(error, results, fields) {
            if (error) throw error;

            changeItemQty = inquirerResponse.ItemQuantity;
            changeItem = inquirerResponse.buyItem;
            OldQty = results[0].stock_quantity;
            item_price = results[0].price

            if (inquirerResponse.ItemQuantity > results[0].stock_quantity) {
                console.log(chalk.red('Insufficient quantity Or Item does not Exist !'))
                connectionEnd();
                return -1;
            } else {
                // process.stdout.write('\x1Bc');
                //Update the quantity with the database value
                connection.query('update bamazon.products set ? where ?', [{
                    stock_quantity: OldQty - changeItemQty
                }, {
                    item_id: changeItem
                }], function(error, result, fields) {

                    console.log(chalk.green(' -> Total Order Amount: ' + changeItemQty * item_price));

                    connection.query('update bamazon.products set product_sales = product_sales +' + changeItemQty * item_price + ' where ?', [{
                        item_id: changeItem
                    }], function(error, result, fields) {
                        if (error) throw error;

                        console.log(chalk.blue('Product Sales Updated'))
                        connectionEnd();
                    })

                })
            }
        });

    })
}





displayProducts();