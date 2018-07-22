
var {mongoose}=require('./../db/mongoose.js');

var login=mongoose.model('login',{
  username:
  {
    type:String,
    required:true,
    minlength:1,
    trim:true//should not contain only white spaces
  },
  password:
  {
    type:String,
    required:true,
    minlength:1,
    trim:true//should not contain only white spaces
  }
});
module.exports=
{
   login:login
};
