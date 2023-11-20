const express           = require("express");
const cors              = require("morgan");
const csrf              = require("csurf");
const session           = require("express-session");
const cookieParser      = require("cookie-parser");
const path              = require("path");
const MongoStore        = require("connect-mongo");
const flash             = require("connect-flash");
const marked            = require("marked");
const createDOMPurify   = require('dompurify');
const { JSDOM }         = require('jsdom');

require("dotenv").config();

const app = express();

app.use(express.urlencoded({ extended: true }));
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

    if (req.session.user) {
        res.locals.markdown = function (content) {
            let DOMPurify = createDOMPurify(new JSDOM('').window);

            let lines = content.split("\n")
            let html = lines.map(line => marked.parse(line + "<br>", { gfm: true, breaks: true })).join("");
            
            return DOMPurify.sanitize(html);
        };
    }

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
            console.log(err);
            req.flash('errors', 'Cross-site forgery detected');
            req.session.save(() => res.redirect('back')); // with flash
            res.redirect('back');
        } else {
            console.log(err)
            res.status(400).send(err);
        }
    }
})

module.exports = app;