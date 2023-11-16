const router        = require("express").Router();
const controller    = require("./controllers/main");
const faeController = require("./controllers/fae");

router.get('/',                         controller.home);

// Cuss Timer Routes
router.get('/very-secret-compartment',  controller.vsc);
router.post('/rando-just-cussed',       controller.logTheCuss, controller.randoJustCussed);
router.post('/revert-cuss',             controller.revertCuss);

// Fae Recipe Book Routes
// router.get('/register',                     controller.registerScreen);
router.get('/fae-sparkles',                 faeController.faeGrimoire);
router.post('/fae-sparkles/add-recipe',     faeController.addRecipe);
router.post('/fae-sparkles/edit-recipe',    faeController.editRecipe);
router.post('/fae-sparkles/delete-recipe',  faeController.deleteRecipe);

// Admin Routes
// router.get('/admin',            controller.admin);
router.post('/login',     controller.login);
// router.post('/register',  controller.register);
router.post('/logout',    controller.mustBeLoggedIn, controller.logout);

module.exports = router;