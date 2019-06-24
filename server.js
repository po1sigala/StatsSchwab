// requires express
const express = require("express");
// sets port
const PORT = process.env.PORT || 3000;
// creating an express server
const app = express();
// requires handlebars
app.use(express.static("public"));
const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main"}));
app.set("view engine", "handlebars");

// routing
app.get("/", (req, res)=> {
    res.render("index");
});

// starts our server
app.listen(PORT, function(){
    console.log("App listening on PORT: " + PORT);
});