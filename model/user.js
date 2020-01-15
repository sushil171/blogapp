var mongoose=require("mongoose");
var passportlocalmongoose=require("passport-local-mongoose");
var userschema=new mongoose.Schema(
  {
   username:
   {
     type:String,
     maxlength:255,
     required:true
   },

   email :
   {
      type: String,
      unique:true,
      required:'Please enter your email'
   },

    password:{
       type: String,
       //minlength:6,
       
        },

     resetPasswordToken: String,
     resetPasswordExpires: Date
  });

  //take cae of hashing and salt (plugin wala)
  userschema.plugin(passportlocalmongoose);
  module.exports=mongoose.model("user",userschema);
