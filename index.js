// index.js
const express = require('express');
const sql = require('mssql');
const path = require('path');
const config = require('./config');

const app = express();
const port = 8000;

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



// Route to handle home page
app.get('/', async (req, res) => {
    
    res.render('task1');
});

//Route to handle task2 page
app.get('/task2', async (req, res) => {
    try {
      let pool = await sql.connect(config.sqlConfig);
      let result = await pool.request().query('SELECT TOP 20 * FROM SalesLT.Customer');
      
      // Extract rows
      let rows = result.recordset;
      
      // Extract columns
      let columns = result.recordset.length > 0 
        ? Object.keys(result.recordset[0])
        : []; // Default to an empty array if no rows
  
      res.render('task2', { data: rows, columns: columns });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });
  

// // Route to handle task3 page
app.get('/task3', async (req, res) => {
    try {
      let pool = await sql.connect(config.sqlConfig);
      let result = await pool.request().query(`
        SELECT SalesLT.Product.Name AS ProductName, SalesLT.Product.Color, SalesLT.Product.Size, SalesLT.Product.Weight
        FROM SalesLT.Product
        JOIN SalesLT.ProductCategory ON SalesLT.Product.ProductCategoryID = SalesLT.ProductCategory.ProductCategoryID
      `);
  
      // Extract rows
      let rows = result.recordset;
  
      // Extract column names from the keys of the first row object
      let columns = rows.length > 0 ? Object.keys(rows[0]) : [];
  
      res.render('task3', { data: rows, columns: columns });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
