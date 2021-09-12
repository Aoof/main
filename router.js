const router        = require("express").Router();
const controller    = require("./controllers/main");

router.get('/',                 controller.home);
// router.get('/admin',            controller.admin);
// router.post('/admin-login',     controller.login);
// router.post('/admin-logout',    controller.mustBeLoggedIn, controller.logout);

module.exports = router;