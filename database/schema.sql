DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE departments (
    id INT NOT NULL AUTO_INCREMENT,
    depoName VARCHAR(30) UNIQUE NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE roles (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL UNIQUE,
    salary FLOAT NOT NULL,
    department_id INT,
    PRIMARY KEY (id),
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE
    SET NULL
);

CREATE TABLE employees (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    manager_id INT REFERENCES employees(id),
    PRIMARY KEY (id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE
    SET NULL
);