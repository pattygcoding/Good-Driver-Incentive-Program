const express = require('express');
const path = require('path');
const cors = require('cors')
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
var session = require('express-session')

const PORT = process.env.PORT || 4000;

const app = express();

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

app.use(cors());

const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
  secret: "secret",
  saveUninitialized:true,
  cookie: {maxAge: oneDay},
  resave: false
}));

const mysql = require('mysql');
const { response } = require('express');
const { rmSync } = require('fs');

var connection = mysql.createConnection({
  host: "groupfour-database.crvi1tvxyfsa.us-east-1.rds.amazonaws.com",
  user: "admin",
  password: "cpsc4910group4",
  port: "3306",
  database: "new_schema"
});

connection.connect(function(err) {
  if(err){
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to database');
})

//Require endpoints from other files
require('./endpoints/listusers')(app, connection);
require('./endpoints/points')(app, connection);
require('./endpoints/usertype')(app, connection);
require('./endpoints/login-attempt')(app, connection);
require('./endpoints/signup-attempt')(app, connection);
require('./endpoints/resetemail-attempt')(app, connection);
require('./endpoints/updateaccount')(app, connection);
require('./endpoints/organizations')(app, connection);
require('./endpoints/adduser')(app, connection);
require('./endpoints/resetpass-attempt')(app, connection);
require('./endpoints/reporting')(app, connection);
require('./endpoints/catalog')(app, connection);
require('./endpoints/orders')(app, connection);
require('./endpoints/neworganization-attempt')(app, connection);
require('./endpoints/changeviews')(app, connection);
require('./endpoints/pointHistorySort')(app, connection);

app.get('/test', (req, res) => {
    connection.query('SELECT * FROM test.test_table', (err, results) => {
      if(err){
        return res.send(err)
      }
      else {
        return res.json({
          data: results
        })
      }
    })
});

app.use(express.static(path.join(__dirname, "../react-client", 'build')));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, "../react-client", 'build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Node server listening on port ${PORT}`)
});