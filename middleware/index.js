//Middleware requirements
var Blog = require("../models/blogs");
var Comment = require("../models/comments");

//Middleware declarations

middlewareObj = {}; //Empty middleware object that will be filled with middleware functions below


middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    };
    req.flash("error", "You need to be logged in first")
    res.redirect("/login");
}

middlewareObj.checkBlogOwnership = function(req, res, next) {
     //Modified this function to prevent the application being crashed 
     Blog.findById(req.params.id, function(err, foundBlog){
        if(err || !foundBlog){
            console.log(err);
           
            res.redirect('/blogs');
        } else if(foundBlog.author.id.equals(req.user._id) || req.user.isAdmin){
            req.blog = foundBlog;
            next();
        } else {
           
            res.redirect('/blogs/' + req.params.id);
        }
      });
    
    //=======Code that has a app crashing bug====
    // if (req.isAuthenticated()) {
    //     Blog.findById(req.params.id, function (err, editBlog) {
    //         if (err) {
    //             console.log("Not found");
    //             res.redirect("/blogs")
    //         } else {
    //             next(); //If the user is the one who created then run the next part
    //             if (blog.author.id.equals(req.user._id)) {
    //                 next();
    //             } else {
    //                 res.redirect("back");
    //             }
    //         }
    //     });
    // } else {
    //     console.log("Not authorised");
    //     res.redirect("back");
    // }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated) {
        Comment.findById(req.params.c_id, function(err, foundComment){
            if(err){
                console.log("Cannot find Comment")
                res.redirect("back")
            } else {
                if(foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                };
            };
        });
    } else {
        console.log("You need to be logged in to do that");
        res.redirect("back");
    }
}

module.exports = middlewareObj;