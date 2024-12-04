require('dotenv').config();
require("./src/models/connection");
// const mongoose = require('mongoose');

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./src/routes/index');
const usersRouter = require('./src/routes/users');

var app = express();

const cors = require('cors');
app.use(
    cors({
      origin: ["http://localhost:3000"],
      credentials: true,
      exposedHeaders: ["set-cookie"],
    })
  );
  
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));// permet de faire fonctionner le passage de données du front vers le back par req.body
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// mongoose
//   .connect(process.env.CONNECTION_STRING)
//   .then(() => {
//     console.log("Database Connected");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;



