const Recipe = require('../classes/Recipe');

module.exports = {
    async faeGrimoire(req, res, next) {
        if (req.session.user) {
            let recipe = new Recipe();
            recipe.getRecipes().then(async recipes => {
                let allIngredients = await recipe.getIngredients();
                let allTags = await recipe.getTags();
                let allFoodTypes = await recipe.getFoodTypes();
                let allCookTimes = await recipe.getCookTimes();

                let searchTags = req.query.tags || [];
                searchTags = typeof searchTags == "string" ? searchTags.split(',') : [];

                res.render('fae/fae-sparkles', {recipes, allIngredients, allFoodTypes, allCookTimes, allTags, searchTags});
            }).catch(err => {
                res.render('fae/fae-sparkles', {recipes: []});
            });
        } else {
            res.render('fae/login');
        }
    },
    async recipe(req, res, next) {
        let recipe = new Recipe();
        let recipes = await recipe.getRecipes();
        let recipeToDisplay = recipes.find(recipe => recipe._id == req.params.id);

        res.render('fae/recipe', {recipe: recipeToDisplay});
    },
    async apiGetRecipes(req, res, next) {
        try {
            let recipe = new Recipe();
            let recipes = await recipe.getRecipes();
            res.json(recipes);
        } catch (err) {
            res.json([]);
        }
    },
    async addRecipeScreen(req, res, next) {
        let recipe = new Recipe();

        let allIngredients = await recipe.getIngredients();
        let allTags = await recipe.getTags();
        let allFoodTypes = await recipe.getFoodTypes();
        let allCookTimes = await recipe.getCookTimes();

        res.render('fae/add-recipe', {allIngredients, allFoodTypes, allCookTimes, allTags});
    },
    async editRecipeScreen(req, res, next) {
        let recipe = new Recipe();
        let recipes = await recipe.getRecipes();
        let recipeToEdit = recipes.find(recipe => recipe._id == req.params.id);

        let allIngredients = await recipe.getIngredients();
        let allTags = await recipe.getTags();
        let allFoodTypes = await recipe.getFoodTypes();
        let allCookTimes = await recipe.getCookTimes();

        res.render('fae/edit-recipe', {recipe: recipeToEdit, allIngredients, allFoodTypes, allCookTimes, allTags});
    },
    addRecipe(req, res, next) {  
        let recipe = new Recipe(req.body);
        recipe.addRecipe().then(() => {
            res.status(200).send('Recipe added successfully.');
        }).catch((err) => {
            res.status(500).send(err);
        });
    },
    async editRecipe(req, res, next) {
        req.body._id = req.params.id;
        let recipe = new Recipe(req.body);
        recipe.updateMode = true;

        let recipes = await recipe.getRecipes();
        let recipeToEdit = recipes.find(recipe => recipe._id == req.params.id);

        recipe.data.createdDate = recipeToEdit.createdDate;

        recipe.editRecipe().then(() => {
            req.flash('success', 'Recipe updated successfully.');
            req.session.save(() => res.redirect('back'));
        }).catch((err) => {
            if (typeof(err) == 'string') err = [err];
            err.forEach(error => {
                req.flash('errors', error);
            });
            req.session.save(() => res.redirect('back'));
        });
    },
    deleteRecipe(req, res, next) {
        req.body._id = req.params.id;
        let recipe = new Recipe(req.body);
        recipe.updateMode = true;
        recipe.deleteRecipe().then(() => {
            req.flash('success', 'Recipe deleted successfully.');
            req.session.save(() => res.redirect('/fae-sparkles'));
        }).catch((err) => {
            if (typeof(err) == 'string') err = [err];
            err.forEach(error => {
                req.flash('errors', error);
            });
            req.session.save(() => res.redirect('back'));
        });
    }
}