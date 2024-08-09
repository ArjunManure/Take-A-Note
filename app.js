require('dotenv').config();

const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const methodOverride = require("method-override");
const connectDB = require("./server/config/database");
const session = require("express-session");
const passport = require('passport');
const MongoStore = require('connect-mongo');

const app = express();

const port = 5000 || process.env.PORT;

app.use(session({
    secret: 'keyboard cat',
    resave : false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl : "mongodb://localhost:27017/notes-website"
    }),

   // cookie: {maxAge: new Date (Date.now() +(3600000)) }   for session expiry
}));


app.use(express.urlencoded({extended : true}));
app.use(express.json());

app.use(methodOverride("_method"));

app.use(express.static("public"));

app.use(passport.initialize());
app.use(passport.session());

//connecting to databse

connectDB();

// Templenting engine

app.use(expressLayouts);
app.set("layout","./layouts/main");
app.set("view engine","ejs");

//Routes

app.use("/",require("./server/routes/auth"));
app.use("/",require("./server/routes/index"));
app.use("/",require("./server/routes/dashboard"));


app.get("*",function(req,res) {
    res.status(404).render("notFound");
})

app.listen(port,() =>{
    console.log("Server listening at 5000");
})