var express = require("express");
var methodoverride = require("method-override");
var bodyparser = require("body-parser");
var expresssanitizer = require("express-sanitizer");
var mongoose = require("mongoose");
var passport = require("passport");
var upload = require("multer");
var localstrategy = require("passport-local");
var app = express();
var viewEngine = require("view-engine");
var path = require('path');
mongoose.Promise = global.Promise;
var campground = require("./model/campground");
var comment = require("./model/comment");
var user = require("./model/user");
var seedDB = require("./seed");
// seedDB();//seed database

const ejsLint = require('ejs-lint');
mongoose.connect("mongodb://localhost:27017/BlogApp", {
  useNewUrlParser: true
}).then((res) => console.log("Database connected")).catch(err => console.log(err));
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);


app.engine('html', require('ejs').renderFile);
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname + "/public")));
app.use(bodyparser.urlencoded({
  extended: true
}));
//always use app.use(expresssanitizer()); after app.use(bodyparser.urlencoded({extended:true}) );
app.use(expresssanitizer());
app.use(methodoverride("_method"));
app.use(require("express-session")({
  secret: "rusty is the best",
  resave: false,
  saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());


app.use(function (req, res, next) {
  res.locals.currentuser = req.user;
  next();
});
//======= reduced code here======
var campgroundroute = require("./routes/campground");
var commentroute = require("./routes/comment");
var authroute = require("./routes/authroute");
app.use(campgroundroute);
app.use("/campground/:id/comment", commentroute);
app.use(authroute);
//==========================

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login")

}
let PORT = 3000 || process.env.PORT;
app.listen(PORT, function () {
  console.log(`server started at ${PORT}`);
});