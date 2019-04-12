var express = require("express");
var router = express.Router({ mergeParams: true });
var Blog = require("../models/blogs");
var Comment = require("../models/comments");
var middleware = require("../middleware");

//========================Comments REST routes===================

//New commnets route
router.get("/blogs/:id/comments/new", middleware.isLoggedIn, function (req, res) {
    //find blog
    Blog.findById(req.params.id, function (err, blog) {
        if (err) {
            console.log("Error finding blog")
        } else {
            //render new comment template
            res.render("comments/new", { blog: blog });
        }
    })
});

//Create comment route
router.post("/blogs/:id/comments", middleware.isLoggedIn, function (req, res) {
    //Find blog by id
    Blog.findById(req.params.id, function (err, blog) {
        if (err) {
            console.log("error")
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log("error");
                } else {
                    //add username and id to blog
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    //Connect new comment to DB
                    blog.comments.push(comment);
                    blog.save();
                    //redirect to blog
                    req.flash("success", "Comment successfully added");
                    res.redirect("/blogs/" + blog._id);
                };
            });
        };
    });
});

//Edit comment route
router.get("/blogs/:id/comments/:c_id/edit", middleware.checkCommentOwnership, function (req, res) {
    Comment.findById(req.params.c_id, function (err, foundComment) {
        if (err) {
            console.log("Cannot find comment");
        } else {
            res.render("comments/edit", { blog_id: req.params.id, comment: foundComment });
        }
    })

})

//Update comment route
router.put("/blogs/:id/comments/:c_id", middleware.checkCommentOwnership, function (req, res) {
    Comment.findByIdAndUpdate(req.params.c_id, req.body.comment, function (err, updatedCommment) {
        if (err) {
            console.log("Comment was not updated");
        } else {
            req.flash("success", "Comment successfully updated");
            res.redirect("/blogs/" + req.params.id);
        };
    });
});

//Delete route
router.delete("/blogs/:id/comments/:c_id", middleware.checkCommentOwnership, function (req, res) {
    Comment.findByIdAndRemove(req.params.c_id, function (err) {
        if (err) {
            req.flash("error", "Failed to delete comment");
            console.log("Failed to delete comment");
        } else {
            req.flash("success", "You have succesfully deleted the comment");
            res.redirect("/blogs/" + req.params.id)
        };
    });
});



module.exports = router;