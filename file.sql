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

select * from bamazon.products;

insert into bamazon.products(product_name,department_name,price,stock_quantity)
values ('Kindle','Devices',99.80,1000);


insert into bamazon.products(product_name,department_name,price,stock_quantity)
values ('Fire HD','Devices',59.99,10000);

insert into bamazon.products(product_name,department_name,price,stock_quantity)
values ('Cloud Cam','Devices',99.99,10000);

insert into bamazon.products(product_name,department_name,price,stock_quantity)
values ('Echo Show','Devices',179.99,100);


