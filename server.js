const express = require('express');
const db = require('./db'); // Import the database connection module

const ejs = require('ejs');
const indexRouter = require('./routes/index');
const backend = require('./routes/backend');


const app = express();

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Middleware to pass the database connection to every route
app.use((req, res, next) => {
  req.db = db; // Attach the database connection to the request object
  next();
});


// Define a route to run index page automode on 
app.use('/',indexRouter);
app.use(express.urlencoded({ extended: true }));
app.use('/backend',backend );








// Start the server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
