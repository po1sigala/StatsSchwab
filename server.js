// requires express
const express = require("express");
const connection = require('./config/connection');
// get all the tools we need for authentication 
const session  = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
// allows access to info in .env file
require("dotenv").config();

// configuration ===============================================================
// connect to our database

require('./config/passport')(passport); // pass passport for configuration

// sets port
const PORT = process.env.PORT;
// creating an express server
const app = express();

// requires handlebars
app.use(express.static("public"));
const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main"}));
app.set("view engine", "handlebars");

app.use(express.static("public"));

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

// required for passport
app.use(session({
	secret: 'vidyapathaisalwaysrunning',
	resave: true,
	saveUninitialized: true
 } )); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// routing
app.get("/", (req, res)=> {
    res.render("index", {title: "Home Page"});
});

app.get("/register", (req,res)=> {
    res.render("register", {title: "Register"});
});

app.get("/dashboard", (req, res)=> {
    res.render("dashboard");
});

app.get("/login", (req, res)=> {
    res.render("login");
});

app.get("*", (req, res)=> {
    res.render("index");
});

require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

connection.connect(function(err) {
    if (err) {
      throw err;
    }

    console.log("MySQL is connected as id " + connection.threadId);
    app.listen(PORT, function(){
        console.log("App listening on PORT: " + PORT);
    });
});

// starts our server