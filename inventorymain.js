const fs = require('fs');
const _ = require('lodash')
const yargs = require('yargs');
const express=require('express');
const hbs=require('hbs');
const path=require('path');
const port=process.env.PORT||3000;
const bodyParser = require('body-parser');

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({
    extended: false
});

var app=express();

hbs.registerPartials(__dirname+'/views/partials');
app.set('view engine','hbs');
app.use(express.static(__dirname+'/views'));
const definitions = require('./definitions.js');

// const nameOptions = {
//   describe: 'Name of note',
//   demand: true,
//   alias: 'n'
// };
//
// const productOptions = {
//   describe: 'Name of product',
//   demand: true,
//   alias: 'p'
// };
//
// const quantityOptions = {
//   describe: 'Name of product',
//   demand: true,
//   alias: 'q'
// };
//
// const argv = yargs
//   .command('addCategory', 'Add a new note', {
//     product: productOptions,
//     name: nameOptions,
//     quantity: quantityOptions
//   })
//   .command('getAllCategories', 'To get all notes')
//   .command('Addquantity', 'Reading a note', {
//     product: productOptions,
//     name: nameOptions,
//     quantity: quantityOptions
//   })
//   .command('Removequantity', 'Removing a note', {
//     product: productOptions,
//     name: nameOptions,
//     quantity: quantityOptions
//
//   })
//   .help()
//   .argv;
//
// var command = argv._[0];
//console.log('Process.Argv',process.argv);
//console.log('Yargs.Argv',yargs.argv);
//console.log('Command:',command);

// if (command === 'addCategory') {
//   console.log('Adding Category');
//   var note = definitions.addCategory(argv.name, argv.product,argv.quantity);
//   if (typeof(note) === "undefined") {
//     console.log("This is a duplicate product");
//   } else {
//     definitions.logNote(note);
//   }
// } else if (command === 'getAllCategories') {
//   console.log("All note(s) :");
//   var notem = definitions.getAllCategories();
//   var i;
//   for (i = 0; i < notem.length; i++) {
//     definitions.logNote(notem[i]);
//   }
//
// } else if (command === 'Removequantity') {
//
//   var noteremoved = definitions.Removequantity(argv.name,argv.product,argv.quantity);
//   var message = noteremoved ? 'Quantity was removed' : 'Product was not found';
//   console.log(message);
//
// } else if (command === 'Addquantity') {
//   var noteadded = definitions.Addquantity(argv.name,argv.product,argv.quantity);
//   var message = noteadded ? 'Quantity was added' : 'Product was not found';
//   console.log(message);
// } else {
//   console.log('Not recognized');
// }

app.use((req,res,next) =>
{
  var now=new Date().toString();
  var log=`${now} ${req.method} ${req.url}`;

  console.log(log);
  fs.appendFile('server.log',log+'\n',(error) =>
{
  if(error)
  {
  console.log('There was an error');
  }
});
next();
});
hbs.registerHelper('getCurrentYear',()=>
{
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt',(text)=>
{
  return text.toUpperCase();
});
app.get('/',(req,res)=> {
  res.render('loginpage.hbs',{
    pageTitle:'Inventory'
  });
});
app.get('/home',(req,res)=> {
  res.render('home.hbs',{
    pageTitle:'Inventory'
  });
});
app.get('/addcategory',(req,res)=> {
  res.render('addcategory.hbs',{
    pageTitle:'Add Category'
  });
});
app.get('/addquantity',(req,res)=> {
  res.render('addquantity.hbs',{
    pageTitle:'Add Quantity'
  });
});
app.get('/removequantity',(req,res)=> {
  res.render('removequantity.hbs',{
    pageTitle:'Remove Quantity'
  });
});

app.post('/', urlencodedParser, function (req, res) {
    // Prepare output in JSON format

    var bool = definitions.checklogin(req.body.username,req.body.password);
    if(bool===true)
    {
      res.render('home.hbs',{
        pageTitle:'Inventory'
      });
    }
    else {
      res.end('Incorrect id/password');
    }
});

app.post('/addcategory', urlencodedParser, function (req, res) {
    // Prepare output in JSON format

    var bool = definitions.addCategory(req.body.name,req.body.product,parseInt(req.body.quantity));
    var message = bool ? 'Product Category was added':'This product already exists';
    console.log(req.body.name);
    res.render('commonresponse.hbs',{
      pageTitle: message
    });
});
app.post('/addq', urlencodedParser, function (req, res) {

    var bool = definitions.Addquantity(req.body.name,req.body.product,parseInt(req.body.quantity));
    var message = bool ? 'Quantity was added':'No such product found';
    console.log(message);
    res.render('commonresponse.hbs',{
      pageTitle: message
    });
});

app.post('/removeq', urlencodedParser, function (req, res) {
    var bool = definitions.Removequantity(req.body.name,req.body.product,parseInt(req.body.quantity));
    var message = bool ? 'Quantity was removed':'No such product exists';
    console.log(message);
    res.render('commonresponse.hbs',{
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
  fs.readFile(__dirname + "/" + "categories.json", 'utf8', (err, data) => {
      res.send(data);
  });
});

app.get('/view', (req, res) => {
  res.sendfile(__dirname + "/" + "view.html");
});

app.listen(port,()=>
{
  console.log(`The server is on at ${port} port`)
});
