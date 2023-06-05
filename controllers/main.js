const User = require("../classes/User");
const Rando = require("../classes/Rando");

module.exports = {
    home(req, res, next) {
        res.render("index");
    },
    admin(req, res, next) {
        if (!req.session.user.username == "admin") {
            res.render("adminlogin");
        } else {
            res.render("admin");
        }
    },
    async vsc(req, res, next) {
        let dummy = new Rando({name: ""});
        let randos, logs;
        try {
            randos = await dummy.getAllRandos();
            logs = await dummy.getLogs();
            
            res.render("vsc", { randos: randos, logs: logs });
        } catch (e) {
            req.flash("errors", "Please try again later.");
            req.session.save(() => res.redirect("back"));
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
    },
    register(req, res, next) {
        let user = new User(req.body);
        user.register()
        .then(() => {
            req.session.user = { username: user.data.username };
            req.session.save(() => res.redirect("/"));
        })
        .catch((regErrors) => {
            regErrors.forEach(e => req.flash("regErrors", e));
            req.session.save(() => res.redirect("back"));
        })
    },
    revertCuss (req, res, next) {
        let rando = new Rando(req.body, true);
        rando.revertToLegacy()
        .then(() => {
            req.flash("success", "Cuss reverted!");
            req.session.save(() => res.redirect("back"));
        })
        .catch((errors) => {
            errors.forEach(e => req.flash("errors", e));
            req.session.save(() => res.redirect("back"));
        })
    },
    logTheCuss(req, res, next) {
        let rando = new Rando(req.body, true);
        rando.logTheCuss()
        .then(() => {
            next();
        })
        .catch((errors) => {
            errors.forEach(e => req.flash("errors", e));
            req.session.save(() => res.redirect("back"));
        })
    },
    randoJustCussed(req, res, next) {
        let rando = new Rando(req.body);
        rando.randoJustCussed()
        .then(() => {
            req.flash("success", "Cuss logged!");
            req.session.save(() => res.redirect("back"));
        })
        .catch((errors) => {
            errors.forEach(e => req.flash("errors", e));
            req.session.save(() => res.redirect("back"));
        })
    }
}