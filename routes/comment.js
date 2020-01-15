var express=require("express");
//=================================================
//for normal
//var router=express.Router();
//for when reduce route and need to merge them
var router=express.Router({mergeParams:true});
//============================================
var campground=require("../model/campground");
var comment=require("../model/comment");
var user=require("../model/user");
var middleware=require("../middleware");
//=================================
//for normal
//router.get("/campground/:id/comment/new",isLoggedIn,function(req,res){
//for when reduce route  where "/campground/:id/comment" used in app.js
router.get("/new",middleware.isLoggedIn,function(req,res){
//===================================================
  campground.findById(req.params.id,function(err,campground){
    if(err)
    console.log(err);
    else {
      res.render("new.ejs",{campground:campground});
    }
  })


});
//==============================================
//for normal
//router.post("/campground/:id/comment",isLoggedIn,function(req,res){
  //for when reduce route  where "/campground/:id/comment" used in app.js
router.post("/",middleware.isLoggedIn,function(req,res){
//==================================================
//lookup campground using id
campground.findById(req.params.id,function(err,campground){
if(err)
{
  console.log(err);
  res.redirect("/campground");}
  else {
    comment.create(req.body.comment,function(err,comment){
      if(err)
      console.log(err);
      else {
        comment.author.id=req.user._id;
        comment.author.username=req.user.username;
        comment.save();

        campground.comment.push(comment);
         campground.save();
        res.redirect("/campground/" + campground._id);
      }
    })
  }
})
});


//comment edit route
router.get("/:comment_id/edit",middleware.checkcommentownership ,function(req,res){
  comment.findById(req.params.comment_id,function(err,foundcomment){
    if(err){
      res.redirect("back");
    }else {
       res.render("comment_edit.ejs",{campground_id:req.params.id,comment:foundcomment});
    }
  });


});

//comment update

router.put("/:comment_id",middleware.checkcommentownership ,function(req,res){
 comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatecomment){
   if(err)
   res.redirect("back");
   else {
     res.redirect("/campground/"+ req.params.id);
   }
 });


});


//destroy comment route====


router.delete("/:comment_id",middleware.checkcommentownership ,function(req,res){
 comment.findByIdAndRemove(req.params.comment_id,function(err,removecomment){
   if(err)
   res.redirect("back");
   else {
     res.redirect("/campground/"+ req.params.id);
   }
 });


});

//check ownership for commentid



//===middleware============




module.exports=router;
