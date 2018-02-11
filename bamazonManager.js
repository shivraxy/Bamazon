let inquirer = require("inquirer");
let mysql = require("mysql");
const cTable = require('console.table');
let chalk = require("chalk");

connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Maverick7$",
    database: "bamazon"
});

connectionEnd = function() {
    connection.end();
}


connection.connect(function(error) {
    if (error) throw error;
    console.log('Connection Established')
    managerInput();
});

managerInput = function() {

    process.stdout.write('\x1Bc');

    inquirer.prompt([{
        type: 'list',
        choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'Exit'],
        message: "Select an Option",
        name: "ManagerInput"
    }]).then(function(inquirerResponse) {

        console.log(inquirerResponse.ManagerInput);

        switch (inquirerResponse.ManagerInput) {
            case "View Products for Sale":
                query = "select * from bamazon.products";
                updateObj = [{}];
                process.stdout.write('\x1Bc');
                runQuery(query, updateObj, true, connectionEnd);
                break;
            case "View Low Inventory":
                query = "select * from bamazon.products where stock_quantity < 5";
                updateObj = [{}];
                process.stdout.write('\x1Bc');
                runQuery(query, updateObj, true, connectionEnd);
                break;
            case "Add to Inventory":
                query = "select * from bamazon.products";
                updateObj = [{}];
                process.stdout.write('\x1Bc');
                runQuery(query, updateObj, true, function() {
                    inquirer.prompt([{
                            type: 'input',
                            message: "Enter Product Item ID",
                            name: "ProductID"
                        },
                        {
                            type: 'input',
                            message: "Add Quantity",
                            name: "quantity"
                        }
                    ]).then(function(inquirerResponse) {
                        query = "update bamazon.products set stock_quantity = stock_quantity + " + inquirerResponse.quantity + " where ? ";
                        updateObj = [{ item_id: inquirerResponse.ProductID }];
                        process.stdout.write('\x1Bc');
                        runQuery(query, updateObj, false);
                        console.log(chalk.green('-----After Changes-----'));
                        query = "select * from bamazon.products where ?";
                        runQuery(query, updateObj, true, connectionEnd);
                    });
                });
                break;

            case "Add New Product":
                inquirer.prompt([{
                        type: 'input',
                        message: "Input Product Name",
                        name: "ProductName"
                    },
                    {
                        type: 'input',
                        message: "Input Department Name",
                        name: "DeptName"
                    },
                    {
                        type: 'input',
                        message: "Input Price",
                        name: "Price"
                    },
                    {
                        type: 'input',
                        message: "Input Quantity",
                        name: "quantity"
                    }
                ]).then(function(inquirerResponse) {
                    query = "insert into bamazon.products set ? ";
                    updateObj = [{
                        product_name: inquirerResponse.ProductName,
                        department_name: inquirerResponse.DeptName,
                        price: inquirerResponse.Price,
                        stock_quantity: inquirerResponse.quantity,
                    }];
                    process.stdout.write('\x1Bc');
                    runQuery(query, updateObj, false);
                    console.log(chalk.green('-----After Insert-----'));
                    query = "select * from bamazon.products";
                    runQuery(query, updateObj, true, connectionEnd);
                });
                break;
            case "Exit":
                connectionEnd();
                return;
        }
    });
}

runQuery = function(query, updateObj, display, callback) {
    connection.query(query, updateObj, function(error, results, fields) {
        if (error) throw error;
        if (display) {
            // process.stdout.write('\x1Bc');
            console.log('     ');
            console.table(results);
            console.log("     ");
        }
        if (callback) callback();
    })
}