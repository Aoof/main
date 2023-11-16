const Recipe = require('../classes/Recipe');

module.exports = {
    faeGrimoire: async function(req, res) {
        if (req.session.user) {
            let recipe = new Recipe();
            let recipes = await recipe.getRecipes();

            res.render('fae/fae-sparkles', {recipes: recipes});
        } else {
            res.render('fae/login');
        }
    },
    addRecipeScreen: function(req, res) {
        res.render('fae/add-recipe');
    },
    addRecipe: function(req, res) {
        let recipe = new Recipe(req.body);
        recipe.addRecipe().then(() => {
            res.send('Recipe added successfully.');
        }).catch((err) => {
            res.send(err);
        });
    },
    editRecipe: function(req, res) {
        let recipe = new Recipe(req.body);
        recipe.editRecipe().then(() => {
            res.send('Recipe edited successfully.');
        }).catch((err) => {
            res.send(err);
        });
    },
    deleteRecipe: function(req, res) {
        let recipe = new Recipe(req.body);
        recipe.deleteRecipe().then(() => {
            res.send('Recipe deleted successfully.');
        }).catch((err) => {
            res.send(err);
        });
    }
}