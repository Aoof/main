const router        = require("express").Router();
const controller    = require("./controllers/main");

router.get('/',                         controller.home);
router.get('/very-secret-compartment',  controller.vsc);
router.post('/rando-just-cussed',       controller.randoJustCursed);
// router.get('/admin',            controller.admin);
// router.post('/admin-login',     controller.login);
// router.post('/admin-logout',    controller.mustBeLoggedIn, controller.logout);

module.exports = router;