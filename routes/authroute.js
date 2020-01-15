var flash = require('express-flash');
var express = require("express");
var router = express.Router();
var campground = require("../model/campground");
var passport = require("passport");
var comment = require("../model/comment");
var user = require("../model/user");
var crypto=require("crypto");
var nodemailer = require("nodemailer");
var async = require("async");
router.use(flash());
require('express-async-errors');
//usne authroute ki jagah index.js use kiya hai
// =====login=======

router.get("/login", function (req, res) {
  res.render("login");
});

//app.post("/login",middleware,callback);
router.post("/login", passport.authenticate('local', {
  successRedirect: "/campground",
  failureRedirect: "/login"

}), function (req, res) {
  console.log(req.body);
});


// =====register===========
router.get("/register", function (req, res) {
  res.render("register");
});


router.post("/register", function (req, res) {
  // console.log(req.body);
  user.register(new user({
    username: req.body.username,
    email:req.body.email
  }), req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      return res.render('register');
    }
    passport.authenticate("Localstrategy")(req, res, function () {
      res.redirect("/campground");
    })
  });
});

router.get("/reset", function (req, res) {
  res.render("reset");
});


router.post("/reset",(req,res,next)=>{
console.log(req.body);

async.waterfall([ 
   function(done) {
    
      crypto.randomBytes(20,function(err,buf){
        var token = buf.toString('hex');
        done(err,token);
      });
    },
    function (token, done) {
     
      user.findOne({email : req.body.email},function(err,user){
        if(!user)
        {
          req.flash('error','No account with that email address exist');
           return res.redirect('/reset');
        }

       // console.log("inside findone wprking");
        console.log(user);
        user.resetPasswordToken = token;
        user.resetPasswordExpires=Date.now()+ 3600000 ;//1 hours
       
        user.save(function(err){
          done(err,token,user);
        });
      });
    },
    function (token, user, done) {
     // console.log(config.email);
       var smtpTransport = nodemailer.createTransport({
         service: 'Gmail',
         auth: {
          user:`{config.email}`,
          pass:`{config.password}`
         }
       });

       var mailOptions = {

         from:'abhijeetc960@gmail.com',
         to: user.email,
         subject: 'Reset Password Request ',
          text:'http://' + req.headers.host + '/reset/'+ token
       };


     smtpTransport.sendMail(mailOptions,function(err){
       console.log("message sent");
       req.flash('success','An email has been sent to '+ user.email + 'with further instruction');
        done(err,'done');
     }) ;
    }
],
function (err) {
  if (err)
    return next(err);
  res.redirect('/campground');
});
});

router.get('/reset/:token', function (req, res) {
  // console.log(req.params.token);
  // console.log(req.body);
  user.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: {
      $gt: Date.now()
    }
  }, function (err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/reset');
    }
    res.render('reset-password', {
             token: req.params.token
    });
  });
});


router.post('/reset/:token', function (req, res) {
  // console.log(req.body);
  async.waterfall([
    function (done) {
      user.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {
          $gt: Date.now()
        }
      }, function (err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
    if(req.body.pass === req.body.cnfpass){
      user.setPassword(req.body.pass,function(err){
               user.resetPasswordToken = undefined;
               user.resetPasswordExpires = undefined;

               user.save(function (err) {
                 req.logIn(user, function (err) {
                   done(err, user);
                 });
               });
      });
    }
    else
    {
      req.flash('error','Password do not match');
      return res.redirect('back');
    }
        
      });
    },
    function (user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'abhijeetc960@gmail.com',
          pass: 'NEEDFORSPEED'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'abhijeetc960@gmail.com',
        subject: 'Your password has been changed',
        //text: 'Hello,\n\n' +
        // 'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
        text: `Hii this tutorial useful for sending message through nodemailer`
      };
      smtpTransport.sendMail(mailOptions, function (err, info) {
        req.flash('success', 'Success! Your password has been changed.');
        console.log(info.response);
        done(err);
      });
    }
  ], function (err) {
    res.redirect('/campground');
  });
});



















// first wala neeche hai original forget password iske upper hao



// router.post("/forget_password", function (req, res) {
//   console.log(req.body);
//   // user.updateOne({username: req.body.username}, {username: "SUSHIL"}, (err,res)=>
//   // {
//   //   if (err) return res.redirect('/forget_password');
//   //   return res.redirect('/login');
//   // });
//   user.findOne({
//   "username": req.body.username
//   }, (err, usr) => {
//   // Check if error connecting
//   if (err) {
//     console.log("FALSE");
//     res.json({
//       success: false,
//       message: err
//     }); // Return error
//   } else {
//     // Check if user was found in database
    
//     if (!usr) {
//       console.log("User not found");
//       res.json({
//         success: false,
//         message:'User not found'
//       });
//      // Return error, user was not found in db
//     } else {
//       usr.changePassword(req.body.username, req.body.password, function (err) {
//         if (err) {
//           if (err.name === 'IncorrectPasswordError') {
//             console.log("incorrect password");
//             res.json({
//               success: false,
//               message: 'Incorrect password'
//             }); // Return error
//           } else {
//             console.log("Something went wrond");
//             res.json({
//               success: false,
//               message: 'Something went wrong!! Please try again after sometimes.'
//             });
//           }
//         } else {
//           console.log("Updated successfully");
//           res.json({
//             success: true,
//             message: 'Your password has been changed successfully'
//           });
//         }
//       })
//     }
//   }
//   });

  // user.find({username:req.body.username},function(err,user)
  //   {
  //     if(err) return res.render('register');
  //     return res.redirect('/login');
  //   }
  // );

  // user.deleteOne(req.body.username,(req,res)=>{
    
  //      user.register(new user({
  //        username: req.body.username
  //      }), req.body.password, function (err, user) {
  //        if (err) {
  //          console.log(err);
  //          return res.render('register');
  //        }
  //        passport.authenticate("Localstrategy")(req, res, function () {
  //          res.redirect("/campground");
  //        })
  //      });
     
  // });
// });






///////////////logout////////////

router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  // alert("Enter wrong password or username")
  //res.redirect("/login",)
  res.send.status("401");

}

module.exports = router;