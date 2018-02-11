create database bamazon;
use bamazon;

create table products
(
    item_id integer(100) auto_increment not null,
    product_name varchar(100),
    department_name varchar(100),
    price decimal(10,2),
    stock_quantity integer(10),
    primary key(item_id)
);

alter table bamazon.products
modify product_sales decimal(65,2) default 0;

insert into bamazon.products(product_name,department_name,price,stock_quantity)
values ('Kindle','Devices',99.80,1000);


insert into bamazon.products(product_name,department_name,price,stock_quantity)
values ('Fire HD','Devices',59.99,10000);

insert into bamazon.products(product_name,department_name,price,stock_quantity)
values ('Cloud Cam','Devices',99.99,10000);

insert into bamazon.products(product_name,department_name,price,stock_quantity)
values ('Echo Show','Devices',179.99,100);

select IFNULL(SUM(stock_quantity),0), price stock_quantity 
from bamazon.products
where item_id = '1';


create table departments
(
department_id integer(100) auto_increment not null,
department_name varchar(100),
over_head_costs  decimal(10,2),
primary key(department_id)
);


insert into bamazon.departments(department_name,over_head_costs)
values
('Google',100000.00);

