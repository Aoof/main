const User = require("../classes/User");

module.exports = {
    home(req, res, next) {
        res.render("index");
    } ,
    admin(req, res, next) {
        if (!req.session.user) {
            res.render("adminlogin");
        } else {
            res.render("admin");
        }
    },
    login(req, res, next) {
        let user = new User(req.body);
        user.login()
        .then(e => {
            req.flash("success", e);
            req.session.user = user;
            console.log(e)
        })
        .catch(e => {
            req.flash("errors", e);
            console.log(e)
        })
        .finally(e => {
            req.session.save(() => res.redirect("back"));
        })
    },
    mustBeLoggedIn(req, res, next) {
        if (req.session.user) {
            next();
        } else {
            req.flash("errors", "Must be logged in to use that feature.");
            req.session.save(() => res.redirect("back"));
        }
    },
    logout(req, res, next) {
        req.session.destroy(() => {
            res.redirect("/");
        })
    }
}