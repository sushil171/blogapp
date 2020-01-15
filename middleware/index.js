
var campground=require("../model/campground");
var comment=require("../model/comment");
var middlewareobj={};
middlewareobj.checkcommentownership = function(req,res,next){
       if(req.isAuthenticated())
        {
          //is user same which is want to edit campground
            comment.findById(req.params.comment_id,function(err,foundcomment){
              if(err)
              {
                res.redirect("back");

              }
              else
                {
                    if( foundcomment.author.id.equals(req.user._id))
                    {
                       // res.render("campground_edit.ejs",{campground:foundcampground});
                       next();
                    }
                    else
                    {
                      res.send("You don't have permission !!!");

                    }

                }
            });
        }
        else {
          // console.log("you need to logged in");
          // res.send("You need to logged in!!!");
        res.send("First logged in");//going to prev page

        }

  }

middlewareobj.checkcampgroundownership = function(req,res,next){
       if(req.isAuthenticated())
        {
          //is user same which is want to edit campground
            campground.findById(req.params.id,function(err,foundcampground){
              if(err)
              {
                res.redirect("back");

              }
              else
                {
                    if(foundcampground.author.id.equals(req.user._id))
                    {
                       // res.render("campground_edit.ejs",{campground:foundcampground});
                       next();
                    }
                    else
                    {
                      res.redirect("back");

                    }

                }
            });
        }
        else {
          // console.log("you need to logged in");
          // res.send("You need to logged in!!!");
        res.redirect("back");//going to prev page

        }

  }


  middlewareobj.isLoggedIn=function(req,res,next){
    if(req.isAuthenticated()){
      return next();
    }
   // alert("Enter wrong password or username")
    res.redirect("/login")

  }

module.exports=middlewareobj;
