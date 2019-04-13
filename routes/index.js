var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/users");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");

//Root Route
router.get("/", function (req, res) {
    res.redirect("/blogs"); //We do not have a landing page
});

//===========Authentication routes============

//Register route
router.get("/register", function (req, res) {
    res.render("register");
})

//Register route logic
router.post("/register", function (req, res) {
    var newUser = new User({ username: req.body.username })
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("login");
        }
        passport.authenticate("local")(req, res, function () {
            req.flash("success", "Welcome " + user.username)
            res.redirect("/blogs");
        });
    });
});
//login route
router.get("/login", function (req, res) {
    res.render("login");
})

//login route logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/blogs",
    failureRedirect: "/login"
}), function (req, res) {
    
})

//logout route
router.get("/logout", function (req, res) {
    req.logout();
    req.flash("success", "You have been successfully logged out")
    res.redirect("/blogs")
})


module.exports = router;
