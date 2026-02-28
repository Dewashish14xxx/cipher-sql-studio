/**
 * Seed script: populates MongoDB with sample assignments and
 * ensures the PostgreSQL sandbox tables are created.
 *
 * Run: node src/seed/seed.js
 */
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const connectMongo = require('../config/db');
const Assignment = require('../models/Assignment');

const assignments = [
    {
        title: 'Top Spending Customers',
        description:
            'Find the top 5 customers by total order amount. Return the customer name and their total spending, ordered from highest to lowest.',
        difficulty: 'easy',
        expected_concepts: ['JOIN', 'GROUP BY', 'ORDER BY', 'SUM', 'LIMIT'],
        hint_context:
            'Students often forget to JOIN orders with customers or to aggregate the total.',
        tables: [
            {
                name: 'customers',
                schema_sql: `CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  country VARCHAR(50)
);`,
                seed_sql: `INSERT INTO customers (name, email, country) VALUES
  ('Alice Johnson', 'alice@example.com', 'USA'),
  ('Bob Smith', 'bob@example.com', 'UK'),
  ('Carol White', 'carol@example.com', 'Canada'),
  ('David Brown', 'david@example.com', 'USA'),
  ('Eve Davis', 'eve@example.com', 'Australia'),
  ('Frank Wilson', 'frank@example.com', 'USA'),
  ('Grace Lee', 'grace@example.com', 'Japan');`,
            },
            {
                name: 'orders',
                schema_sql: `CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id),
  amount NUMERIC(10, 2) NOT NULL,
  order_date DATE NOT NULL
);`,
                seed_sql: `INSERT INTO orders (customer_id, amount, order_date) VALUES
  (1, 250.00, '2024-01-15'),
  (1, 180.50, '2024-02-10'),
  (2, 320.00, '2024-01-20'),
  (3, 95.00, '2024-03-05'),
  (3, 410.00, '2024-03-12'),
  (4, 55.00, '2024-02-28'),
  (5, 640.00, '2024-01-08'),
  (5, 200.00, '2024-02-14'),
  (6, 130.00, '2024-04-01'),
  (7, 870.00, '2024-01-30'),
  (7, 340.00, '2024-03-22');`,
            },
        ],
    },
    {
        title: 'Department Salary Report',
        description:
            'For each department, calculate the average salary and the number of employees. Only include departments with more than 2 employees. Order results by average salary descending.',
        difficulty: 'medium',
        expected_concepts: ['JOIN', 'GROUP BY', 'HAVING', 'AVG', 'COUNT', 'ORDER BY'],
        hint_context:
            'Students often confuse WHERE and HAVING. HAVING filters after aggregation.',
        tables: [
            {
                name: 'departments',
                schema_sql: `CREATE TABLE departments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);`,
                seed_sql: `INSERT INTO departments (name) VALUES
  ('Engineering'),
  ('Marketing'),
  ('HR'),
  ('Finance'),
  ('Design');`,
            },
            {
                name: 'employees',
                schema_sql: `CREATE TABLE employees (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  department_id INTEGER REFERENCES departments(id),
  salary NUMERIC(10, 2) NOT NULL,
  hire_date DATE NOT NULL
);`,
                seed_sql: `INSERT INTO employees (name, department_id, salary, hire_date) VALUES
  ('Tom Adams', 1, 95000, '2020-03-15'),
  ('Sara Gold', 1, 105000, '2019-07-01'),
  ('Mike Chen', 1, 88000, '2021-11-20'),
  ('Lisa Park', 1, 112000, '2018-05-10'),
  ('James Wu', 2, 72000, '2021-02-14'),
  ('Anna Bell', 2, 68000, '2022-06-30'),
  ('Chris Fox', 2, 75000, '2020-09-01'),
  ('Diana Ray', 3, 62000, '2023-01-10'),
  ('Ethan Roy', 3, 65000, '2022-11-15'),
  ('Fiona Sky', 4, 82000, '2021-04-20'),
  ('George Sun', 4, 79000, '2020-08-05'),
  ('Hannah Lee', 4, 91000, '2019-12-01'),
  ('Ivan Cruz', 5, 74000, '2022-03-18');`,
            },
        ],
    },
    {
        title: 'Product Sales Ranking',
        description:
            'Find the top 3 products in each category by total revenue (quantity × unit_price). Return category name, product name, total revenue, and rank within the category.',
        difficulty: 'hard',
        expected_concepts: ['JOIN', 'GROUP BY', 'Window Functions', 'RANK()', 'PARTITION BY', 'CTE or Subquery'],
        hint_context:
            'This requires a window function RANK() with PARTITION BY category. A CTE or subquery can help structure the solution.',
        tables: [
            {
                name: 'categories',
                schema_sql: `CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);`,
                seed_sql: `INSERT INTO categories (name) VALUES
  ('Electronics'),
  ('Clothing'),
  ('Books');`,
            },
            {
                name: 'products',
                schema_sql: `CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category_id INTEGER REFERENCES categories(id),
  unit_price NUMERIC(10, 2) NOT NULL
);`,
                seed_sql: `INSERT INTO products (name, category_id, unit_price) VALUES
  ('Laptop Pro', 1, 1299.99),
  ('Wireless Earbuds', 1, 79.99),
  ('Smart Watch', 1, 249.99),
  ('4K Monitor', 1, 549.99),
  ('Classic Tee', 2, 19.99),
  ('Running Shoes', 2, 89.99),
  ('Denim Jacket', 2, 69.99),
  ('Yoga Pants', 2, 49.99),
  ('SQL Mastery', 3, 34.99),
  ('Clean Code', 3, 29.99),
  ('The Pragmatic Programmer', 3, 39.99),
  ('Design Patterns', 3, 44.99);`,
            },
            {
                name: 'sales',
                schema_sql: `CREATE TABLE sales (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  sale_date DATE NOT NULL
);`,
                seed_sql: `INSERT INTO sales (product_id, quantity, sale_date) VALUES
  (1, 15, '2024-01-10'),
  (1, 22, '2024-02-15'),
  (2, 85, '2024-01-25'),
  (2, 60, '2024-02-28'),
  (3, 45, '2024-03-05'),
  (3, 30, '2024-01-18'),
  (4, 10, '2024-02-10'),
  (4, 18, '2024-03-20'),
  (5, 200, '2024-01-15'),
  (5, 150, '2024-02-20'),
  (6, 40, '2024-03-10'),
  (6, 55, '2024-01-30'),
  (7, 30, '2024-02-08'),
  (7, 25, '2024-03-15'),
  (8, 80, '2024-01-22'),
  (8, 95, '2024-02-25'),
  (9, 120, '2024-01-12'),
  (9, 95, '2024-02-18'),
  (10, 200, '2024-03-01'),
  (10, 175, '2024-01-20'),
  (11, 85, '2024-02-14'),
  (11, 70, '2024-03-22'),
  (12, 60, '2024-01-28'),
  (12, 45, '2024-02-27');`,
            },
        ],
    },
    {
        title: 'Customer Order Counts',
        description: 'For each customer, find the total number of orders they have placed. Return the customer name and the order count. Only include customers who have placed at least 1 order.',
        difficulty: 'easy',
        expected_concepts: ['JOIN', 'GROUP BY', 'COUNT'],
        hint_context: 'Use a LEFT JOIN if you want to include 0 counts, but the prompt says at least 1 order, so an INNER JOIN is perfect.',
        tables: [
            {
                name: 'users',
                schema_sql: `CREATE TABLE users (id SERIAL PRIMARY KEY, full_name VARCHAR(100) NOT NULL);`,
                seed_sql: `INSERT INTO users (full_name) VALUES ('Alice Johnson'), ('Bob Smith'), ('Charlie Brown');`
            },
            {
                name: 'purchases',
                schema_sql: `CREATE TABLE purchases (id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users(id), amount NUMERIC(10, 2));`,
                seed_sql: `INSERT INTO purchases (user_id, amount) VALUES (1, 50), (1, 120), (2, 75);`
            }
        ]
    },
    {
        title: 'Active Users in Last 30 Days',
        description: 'Find all unique users who logged in during the month of May 2024. Return their username and the date of their last login in May.',
        difficulty: 'medium',
        expected_concepts: ['MAX', 'GROUP BY', 'Date Filtering'],
        hint_context: 'Remember to group by username and use the MAX function to find the most recent login date.',
        tables: [
            {
                name: 'accounts',
                schema_sql: `CREATE TABLE accounts (id SERIAL PRIMARY KEY, username VARCHAR(50) NOT NULL);`,
                seed_sql: `INSERT INTO accounts (username) VALUES ('dev_guru'), ('sql_master'), ('data_nerd');`
            },
            {
                name: 'logins',
                schema_sql: `CREATE TABLE logins (id SERIAL PRIMARY KEY, account_id INTEGER REFERENCES accounts(id), login_date DATE NOT NULL);`,
                seed_sql: `INSERT INTO logins (account_id, login_date) VALUES (1, '2024-05-10'), (1, '2024-05-25'), (2, '2024-04-15'), (3, '2024-05-01');`
            }
        ]
    },
    {
        title: 'Employee Manager Hierarchy',
        description: 'Find the names of all employees and the names of their direct managers. If an employee has no manager (like the CEO), their manager name should be NULL. Return employee_name and manager_name.',
        difficulty: 'hard',
        expected_concepts: ['Self JOIN', 'LEFT JOIN'],
        hint_context: 'You will need to join the staff table to itself (Self JOIN). Provide aliases for both instances so you don\'t confuse them.',
        tables: [
            {
                name: 'staff',
                schema_sql: `CREATE TABLE staff (id SERIAL PRIMARY KEY, name VARCHAR(100) NOT NULL, manager_id INTEGER REFERENCES staff(id));`,
                seed_sql: `INSERT INTO staff (id, name, manager_id) VALUES (1, 'Big Boss', NULL), (2, 'Sales Lead', 1), (3, 'Intern', 2);`
            }
        ]
    },
    {
        title: 'Inventory Restock Report',
        description: 'Create a report of items that need restocking. If quantity is below 20, status is \'Critical\'. If between 20 and 50, status is \'Warning\'. Otherwise \'OK\'. Return item_name, quantity, and status. Only show Critical or Warning items.',
        difficulty: 'medium',
        expected_concepts: ['CASE WHEN', 'Filtering'],
        hint_context: 'Use a CASE WHEN statement to evaluate the quantity and assign a string status. Then filter the results.',
        tables: [
            {
                name: 'inventory',
                schema_sql: `CREATE TABLE inventory (id SERIAL PRIMARY KEY, item_name VARCHAR(100) NOT NULL, quantity INTEGER NOT NULL);`,
                seed_sql: `INSERT INTO inventory (item_name, quantity) VALUES ('Mechanical Keyboard', 15), ('Mousepad', 45), ('USB-C Cable', 120), ('Monitor Stand', 5);`
            }
        ]
    },
    {
        title: 'Top Grossing Categories per Region',
        description: 'Rank product categories by total sales amount within each region. Return region, category, total_sales, and the rank (1 being highest sales).',
        difficulty: 'hard',
        expected_concepts: ['JOIN', 'GROUP BY', 'Window Functions', 'RANK()'],
        hint_context: 'You need to aggregate the sales first, then use RANK() OVER (PARTITION BY region ORDER BY total_sales DESC) in a outer query or CTE.',
        tables: [
            {
                name: 'locations',
                schema_sql: `CREATE TABLE locations (id SERIAL PRIMARY KEY, region VARCHAR(50) NOT NULL);`,
                seed_sql: `INSERT INTO locations (region) VALUES ('North America'), ('Europe');`
            },
            {
                name: 'product_cats',
                schema_sql: `CREATE TABLE product_cats (id SERIAL PRIMARY KEY, name VARCHAR(50) NOT NULL);`,
                seed_sql: `INSERT INTO product_cats (name) VALUES ('Hardware'), ('Software');`
            },
            {
                name: 'regional_sales',
                schema_sql: `CREATE TABLE regional_sales (id SERIAL PRIMARY KEY, location_id INTEGER REFERENCES locations(id), cat_id INTEGER REFERENCES product_cats(id), amount NUMERIC(10,2));`,
                seed_sql: `INSERT INTO regional_sales (location_id, cat_id, amount) VALUES (1, 1, 5000), (1, 2, 7500), (2, 1, 6000), (2, 2, 4000);`
            }
        ]
    }
];

const seed = async () => {
    await connectMongo();
    await Assignment.deleteMany({});
    const inserted = await Assignment.insertMany(assignments);
    console.log(`✅ Seeded ${inserted.length} assignments to MongoDB.`);
    console.log('Assignment IDs:');
    inserted.forEach((a) => console.log(`  ${a.title}: ${a._id}`));
    await mongoose.disconnect();
    console.log('Done. Run the backend and the assignments will appear in the app.');
};

seed().catch((err) => {
    console.error('Seed error:', err);
    process.exit(1);
});
