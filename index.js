const express       = require("express");
const cors          = require("morgan");
const csrf          = require("csurf");
const session       = require("express-session");
const cookieParser  = require("cookie-parser");
const path          = require("path");
const MongoStore    = require("connect-mongo");
const flash         = require("connect-flash");

require("dotenv").config();

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

let sessionOptions = session({
    secret: process.env.SESSIONSECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGODBSTRING })
});

app.use(cookieParser());
app.use(sessionOptions);
app.use(flash());

app.use(async function(req, res, next) {
    res.locals.errors   = req.flash("errors");
    res.locals.success  = req.flash("success");

    res.locals.user = req.session.user;

    next();
})

app.use(cors(':method :url :status :res[content-length] bytes - :response-time ms'));

app.use(express.static(path.join(__dirname, "static")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(csrf())

app.use(async function(req, res, next) {
    res.locals.csrfToken = req.csrfToken();
    next();
})

app.get("/.well-known/acme-challenge/:content", function(req, res) {
    let content = req.params.content;
    let static = path.join(__dirname, "static");
    let challenge = path.join(static, ".well-known", "acme-challenge", content);

    res.sendFile(challenge);
});

app.use("/", require("./router"));

app.use(function(err, req, res, next) {
    if (err) {
        if (err.code == "EBADCSRFTOKEN") {
            // req.flash('errors', 'Cross-site forgery detected');
            // req.session.save(() => res.redirect('back')); // with flash
            res.redirect('back');
        } else {
            res.status(400).send(err);
        }
    }
})

module.exports = app;