const express = require("express");
const cors = require("morgan");
const csrf = require("csurf");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors());

app.use(express.static(path.join(__dirname, "static")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// app.use(csrf())

// app.use(async function(req, res, next) {
//     res.locals.csrfToken = req.csrfToken();
//     next();
// })

app.use("/", require("./router"));

// app.use(function(err, req, res, next) {
//     if (err) {
//         if (err.code == "EBADCSRFTOKEN") {
//             // req.flash('errors', 'Cross-site forgery detected');
//             // req.session.save(() => res.redirect('back')); // with flash
//             res.redirect('back');
//         } else {
//             res.status(400).send(err);
//         }
//     }
// })

let p = process.env.PORT || 8080;
app.listen(p);
console.log(`listening on http://localhost:${p}/`);