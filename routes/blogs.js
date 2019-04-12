var express = require("express");
var router = express.Router();
var Blog = require("../models/blogs");
var methodOverride = require("method-override");
var bodyParser = require("body-parser");
var middleware = require("../middleware");


//REST ROUTES

//Index route
router.get("/blogs", function (req, res) {
    Blog.find({}, function (err, blogs) {
        if (err) {
            res.send("Error")
        } else {
            res.render("blogs/index", { blogs: blogs });
        }
    });
});

//New Route
router.get("/blogs/new", middleware.isLoggedIn, function (req, res) {
    res.render("blogs/new");
});

//Create route
router.post("/blogs", middleware.isLoggedIn, function (req, res) {
    // req.body.blog.body = req.sanitize(req.body.blog.body) //Making sure no malicious code is inserted
    var title = req.body.title,
        image = req.body.image,
        body = req.body.body,
        category = req.body.category,
        author = {
            id: req.user._id,
            username: req.user.username
        };
    var newBlog = {
        title: title,
        image: image,
        body: body,
        category: category,
        author: author
    }
    Blog.create(newBlog, function (err, newBlog) {
        if (err) {
            req.flash("error", "There was a problem adding the blog")
            console.log("error")
        } else {
            req.flash("success", "Blog added successfully")
            res.redirect("/blogs")
        }
    })
});

//Show route
router.get("/blogs/:id", function (req, res) {
    Blog.findById(req.params.id).populate("comments").exec(function (err, idBlog) {
        if (err) {
            res.send("Blog not found");
        } else {
            res.render("blogs/show", { blog: idBlog });
        }
    })
});

//Edit route
router.get("/blogs/:id/edit", middleware.checkBlogOwnership, function (req, res) {
    Blog.findById(req.params.id, function (err, editBlog) {
        res.render("blogs/edit", { blog: editBlog });
    });
});

//Update route
router.put("/blogs/:id", middleware.checkBlogOwnership, function (req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body) //Making sure no malicious code is inserted
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function (err, updateBlog) {
        if (err) {
            res.send("Blog not found");
        } else {
            req.flash("success", "Blog updated successfully")
            res.redirect("/blogs/" + req.params.id)
        }
    });
});

//Delete route
router.delete("/blogs/:id", middleware.checkBlogOwnership, function (req, res) {
    Blog.findByIdAndDelete(req.params.id, function (err) {
        if (err) {
            res.send("Blog not found");
        } else {
            req.flash("success", "Blog deleted successfully")
            res.redirect("/blogs")
        }
    });
});


module.exports = router;