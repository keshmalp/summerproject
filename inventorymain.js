const fs = require('fs');
const _ = require('lodash')
const yargs = require('yargs');
const express = require('express');
const hbs = require('hbs');
const path = require('path');
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');

var {mongoose}=require('./db/mongoose.js');
const products=require('./model/products.js');

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({
  extended: false
});

var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/views'));
const definitions = require('./definitions.js');

app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now} ${req.method} ${req.url}`;

  console.log(log);
  fs.appendFile('server.log', log + '\n', (error) => {
    if (error) {
      console.log('There was an error');
    }
  });
  next();
});
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});
app.get('/', (req, res) => {
  res.render('loginpage.hbs', {
    pageTitle: 'Inventory'
  });
});
app.get('/home', (req, res) => {
  products.products.find({},{},function(err,docs) {
    console.log(docs);
  res.render('home.hbs', {
    pageTitle: 'Inventory',
    productlist: docs
  });
});
});
app.get('/addcategory', (req, res) => {
  res.render('addcategory.hbs', {
    pageTitle: 'Add Category'
  });
});
app.get('/addquantity', (req, res) => {
  res.render('addquantity.hbs', {
    pageTitle: 'Add Quantity'
  });
});
app.get('/removequantity', (req, res) => {
  res.render('removequantity.hbs', {
    pageTitle: 'Remove Quantity'
  });
});

app.post('/', urlencodedParser, function(req, res) {
  // Prepare output in JSON format
  console.log(req.body.username, req.body.password);
  var bool = definitions.checklogin(req.body.username, req.body.password);
  if (bool === true) {
    res.render('home.hbs', {
      pageTitle: 'Inventory'
    });
  } else {
    res.end('Incorrect id/password');
  }
});

app.post('/addcategory', urlencodedParser, function(req, res) {
  // Prepare output in JSON format

  var bool = definitions.addCategory(req.body.name, req.body.product, parseInt(req.body.quantity));
  console.log(bool);
  var message = bool ? 'Product Category was added' : 'This product already exists';
  console.log(req.body.name);
  res.render('commonresponse.hbs', {
    pageTitle: message
  });
});
app.post('/addq', urlencodedParser, function(req, res) {

  var bool = definitions.Addquantity(req.body.name, req.body.product, parseInt(req.body.quantity));
  var message = bool ? 'Quantity was added' : 'No such product found';
  console.log(message);
  res.render('commonresponse.hbs', {
    pageTitle: message
  });
});

app.post('/removeq', urlencodedParser, function(req, res) {
  var bool = definitions.Removequantity(req.body.name, req.body.product, parseInt(req.body.quantity));
  var message = bool ? 'Quantity was removed' : 'No such product exists';
  console.log(message);
  res.render('commonresponse.hbs', {
    pageTitle: message
  });
});


app.get('/list', (req, res) => {
  fs.readFile(__dirname + "/" + "categories.json", 'utf8', (err, data) => {
    res.end(data);
  });
});

//view
app.get('/data', (req, res) => {
  //fs.readFile(__dirname + "/" + "categories.json", 'utf8', (err, data) => {
      products.products.find({},{},function(err,docs) {
        res.send(docs);
  });
});

app.get('/view', (req, res) => {
  res.sendfile(__dirname + "/" + "view.html");
});

app.listen(port, () => {
  console.log(`The server is on at ${port} port`)
});
