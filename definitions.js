const fs = require('fs');
const database =require('./database.js');
const products=require('./model/products.js');
const login=require('./model/login.js');
var mongoose=require('mongoose');



var addCategory = (name,product,quantity) => {
  const database = require('./database.js');
  var found = false;
  products.products.findOne({$and:[{ 'name': name},{'product':product}]}, 'name', function (err, company) {
  if (company===null)
  {
    console.log(company);
    found=false;
  }
  else {
  found=true;
  console.log(company);
}
}).then(()=>
{
  console.log(found);
  if(found===false)
  {
  database.addCategory(name,product,quantity);
  }
});
if(bool===true)
{
  return true;
}
};

var Removequantity = (name,product,quantity) => {
  var found=false;
  var myquery = { name: name, product:product };
  var newvalues = { $inc: {quantity:-quantity } };
  products.products.updateOne(myquery, newvalues, function(err, res) {
    if (err)
    {
      console.log(err);
    }
    else {
    console.log(res);
    found=true;
      }
  })
};

var Addquantity = (name,product,quantity) => {
  
  var found=false;
  var myquery = { name: name, product:product };
  var newvalues = { $inc: {quantity:quantity } };
  products.products.updateOne(myquery, newvalues, function(err, res) {
    if (res.n===0)
    {
      found=false;
      console.log('There was some error');
    }
    else {
      found=true;
    console.log(res);
      }
  });
  if (found===false)
  {
    return false;
  }
  else {
  return true;
    }

};

var checklogin = (uname,pwd) => {
  var found=false;
  // var newProduct=new login.login({
  //   username: uname,
  //   password: pwd
  // });
  //
  // newProduct.save().then((doc)=>
  // {
  //   console.log(JSON.stringify(doc,undefined,2));
  // },
  // (e)=>
  // {
  //   console.log('Unable to save');
  // });
  login.login.findOne({username:uname},{},function(err,log)
  {
  if(log===null)
  {
  console.log(log);
  found=false;
  }
  else {
    console.log(log);
    found=true;
  }
});

 var bool=setTimeout(function(){
   console.log(found);
 },500);
 console.log(bool);
 return true;

};


module.exports = {
  addCategory,
  Removequantity,
  Addquantity,
  checklogin
}
