//Variable declaration
var express          = require("express"),
    mongoose         = require("mongoose"),
    bodyParser       = require("body-parser"),
    methodOverride   = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    flash            = require("connect-flash"),
    User             = require("./models/users"),
    passport         = require("passport"),
    LocalStrategy    = require("passport-local"),
    app              = express();

var blogRoutes      = require("./routes/blogs"),
    commentRoutes   = require("./routes/comments"),
    indexRoutes     = require("./routes/index");

//App setup 
mongoose.connect("mongodb://localhost/blog_main", { useNewUrlParser: true }); //DB Connection
app.use(bodyParser.urlencoded({ extended: true })); //Using body-parser
app.use(methodOverride("_method")); //Setting method-override to look for "_method in html".
app.use(expressSanitizer()); //Using sanitizer for text fields so we do not get code injected
app.set("view engine", "ejs"); //Setting view engine to ejs
app.use(express.static("public")); //Making sure the app will use the public folder
app.use(flash()); //This needs to be above passport declaration

//========Passport configuration=============
app.use(require("express-session")({ //Initializing  express sesion
    secret: "A secrety secret",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Midleware to pass user info to all routes
app.use(function (req, res, next) { //passing data inside the function to all routes
    res.locals.currentUser = req.user; 
    res.locals.error       = req.flash("error");
    res.locals.success     = req.flash("success");
    next();
})

app.use(indexRoutes);
app.use(blogRoutes);
app.use(commentRoutes);


//Server details
app.listen(5000, function () {
    console.log("Server started");
});



