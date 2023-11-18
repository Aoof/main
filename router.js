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
router.get('/api/recipes',                  faeController.apiGetRecipes);
router.get('/fae-sparkles',                 faeController.faeGrimoire);
router.get('/fae-sparkles/recipe/:id',      faeController.recipe);
router.get('/fae-sparkles/add-recipe',      controller.mustBeLoggedIn, faeController.addRecipeScreen);
router.get('/fae-sparkles/edit-recipe/:id', controller.mustBeLoggedIn, faeController.editRecipeScreen);

router.post('/fae-sparkles/add-recipe',     controller.mustBeLoggedIn, faeController.addRecipe);
router.post('/fae-sparkles/edit-recipe/:id',    controller.mustBeLoggedIn, faeController.editRecipe);
router.post('/fae-sparkles/delete-recipe/:id',  controller.mustBeLoggedIn, faeController.deleteRecipe);

// Admin Routes
// router.get('/admin',            controller.admin);
router.post('/login',     controller.login);
// router.post('/register',  controller.register);
router.post('/logout',    controller.mustBeLoggedIn, controller.logout);

module.exports = router;