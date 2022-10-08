/**
 * Main application file.
 * 
 * NOTE: This file contains many required packages, but not all of them - you may need to add more!
 */

// Setup Express
const express = require("express");
const app = express();
const port = process.env.PORT

// Setup Handlebars
const handlebars = require("express-handlebars");
app.engine("handlebars", handlebars({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

// Setup body-parser
app.use(express.urlencoded({ extended: false }));

// Setup cookie-parser
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// Make the "public" folder available statically
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public")));
// Route to the TinyMCE Node module 
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
//route to validator
app.use('/validator', express.static(path.join(__dirname, 'node_modules', 'validator')));
// Use the toaster middleware
app.use(require("./middleware/toaster-middleware.js"));

// Setup routes
const { addUserToLocals } = require("./middleware/auth-middleware.js");
app.use(addUserToLocals);
app.use(require("./routes/auth-routes.js"));
app.use(require("./routes/application-routes.js"));

app.use(require("./routes/article-router.js"));


// Start the server running.
app.listen(port, function () {
    console.log(`App listening on port ${port}!`);
});