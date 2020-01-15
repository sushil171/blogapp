var express=require("express");
var router=express.Router();
var campground=require("../model/campground");
var comment=require("../model/comment");
var user=require("../model/user");
var middleware=require("../middleware");
var multer = require('multer')
var path= require('path')
//var upload = mongoose.model('upload');
var count=0;
//=======================================   Upload Model  =========================== 

// var storage = multer.diskStorage({
//   destination: './public/upload/',
//   filename: function (req, file, cb) {
//     cb(null, (file.fieldname) + '-' +
//       Date.now() +
//       path.extname(file.originalname));
//   }
// });

// var upload = multer({
//   storage: storage,
//   fileFilter: function (req, file, cb) {
//     checkFileType(file, cb);
//   }
// }).single('myimage');

// function checkFileType(file, cb) {
//   const filetype = /jpeg|jpg|png|gif/;
//   const extname = filetype.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = filetype.test(file.mimetype);
//   if (mimetype && extname) {
//     return cb(null, true);

//   } else {
//     return cb('Error:Image Only');
//   }
// }

// // router.get('/upload', middleware.isLoggedIn,function(req, res) 
// // {
// //      upload.find({}, ['path', 'caption'], {
// //         sort: {
// //           _id: -1
// //         }
// //       }, function (err, photos) {

// //         if (err) throw err;
// //         res.render('index', {
// //           title: 'NodeJS file upload tutorial',
// //           msg: req.query.msg,
// //           photolist: photos
// //         });

// //       });
  
// // });

// router.post('/upload', middleware.isLoggedIn,(req, res) => {

//   upload(req, res, (err) => {
//     if (err) {
//       res.render('index', {
//         msg: err
//       });
//     } else {
//       if (req.file == undefined) {
//         res.render('index', {
//           msg: 'error no file selected'
//         });
//       } else {

//         res.render('index', {
//           msg: 'File Uploaded !',
//           file: `upload/${req.file.filename}`

//         });
//       }
//     }
//   })
// });
 





//===============================  Campground  ================
router.get("/",function(req,res)
{
  res.redirect("/campground");
});


router.get("/campground",function(req,res)
{

  //get all campgrounds from db
  campground.find({},function(err,allcampground)
    {
  if(err)
  console.log(err);
  else {
    res.render("campground.ejs",{campground:allcampground, currentuser:req.user});
  }
});
});

 

router.post("/campground", middleware.isLoggedIn, function (req, res)
{
  //  var tmp_path = req.files.path;
  //  var target_path = 'upload/' + req.files.name;
  //   console.log(tmp_path);
  
  var name=req.body.name;
  var image=req.body.image;
  console.log(req.body.image);
  // var upload=req.body.upload;
   var description=req.body.description;
   var author={
     id:req.user._id,
     username:req.user.username
   }
  var newcampground={name:name,image:image,description:description,author:author};
 campground.create(newcampground,function(err,newcreated)
        {
          if(err)
          console.log(err);
          else {
            res.redirect("/campground");
          }
});
});


router.get("/campground/new",middleware.isLoggedIn,function(req,res){
  res.render("addimage.ejs");
});


//SHOW route

router.get("/campground/:id",function(req,res){

  // campground.findById(req.params.id,function(err,foundimage
  //for extract comment through reference use .populate.exec
  campground.findById(req.params.id).populate("comment").exec(function(err,foundcampground){
    if(err)
    {
      console.log(err);
    }
    else {
      console.log(foundcampground);
      res.render("show.ejs",{campground:foundcampground});
    }
  });

});

//======edit route=========
router.get("/campground/:id/edit",middleware.checkcampgroundownership,function(req,res)
{
//is user logged in?
    //is user same which is want to edit campground
    campground.findById(req.params.id,function(err,foundcampground){
     res.render("edit.ejs",{campground:foundcampground});
    });
  });

router.put("/campground/:id",middleware.checkcampgroundownership,function(req,res){
  campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err,updatedcampground){
    if(err)
    {
      // console.log(err);
        res.redirect("/campground");
    }

    else {
      res.redirect("/campground/"+ req.params.id);
    }
  });
});

//========delete route===========
router.delete("/campground/:id",middleware.checkcampgroundownership,function(req,res){
  campground.findByIdAndRemove(req.params.id,function(err){
    if(err)
    {
      // console.log(err);
        res.redirect("/campground");
    }

    else {
      res.redirect("/campground");
    }
  });
});











function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
 // alert("Enter wrong password or username")
  res.redirect("/login")

}


module.exports=router;
