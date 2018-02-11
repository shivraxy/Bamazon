let inquirer = require("inquirer");
let mysql = require("mysql");
const cTable = require('console.table');
let chalk = require("chalk");


connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    database: "bamazon"
});

connectionEnd = function() {
    connection.end();
}

connection.connect(function(error) {
    if (error) throw error;
    console.log('Connection Established')
    SupervisorInput();
});


SupervisorInput = function() {

    process.stdout.write('\x1Bc');

    inquirer.prompt([{
        type: 'list',
        choices: ['View Product Sales by Department', 'Create New Department', 'Exit'],
        message: "Select an Option",
        name: "ManagerInput"
    }]).then(function(inquirerResponse) {

        console.log(inquirerResponse.ManagerInput);

        switch (inquirerResponse.ManagerInput) {
            case "View Product Sales by Department":
                query = "select dept.department_id, dept.department_name, dept.over_head_costs, sum(prod.product_sales) product_sales , greatest(sum(prod.product_sales) - dept.over_head_costs,0)  total_profit from bamazon.products prod right outer join bamazon.departments dept on dept.department_name = prod.department_name  group by dept.department_id, dept.department_name, dept.over_head_costs";
                updateObj = [{}];
                process.stdout.write('\x1Bc');
                runQuery(query, updateObj, true, connectionEnd);
                break;
            case "Create New Department":
                inquirer.prompt([{
                        type: 'input',
                        message: "Input Department Name",
                        name: "DeptName"
                    },
                    {
                        type: 'input',
                        message: "Input Overhead Costs Name",
                        name: "cost"
                    }
                ]).then(function(inquirerResponse) {
                    query = "insert into bamazon.departments set ? ";
                    updateObj = [{
                        department_name: inquirerResponse.DeptName,
                        over_head_costs: inquirerResponse.cost,
                    }];
                    process.stdout.write('\x1Bc');
                    runQuery(query, updateObj, false);
                    console.log(chalk.green('-----After Insert-----'));
                    query = "select * from bamazon.departments";
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