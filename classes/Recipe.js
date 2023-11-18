const recipeCollection = require('../db').collection("recipes");
const { ObjectId } = require('mongodb');

let Recipe = function (data, updateMode = false) {
    this.data = data;
    this.updateMode = updateMode;
    this.errors = [];
}

Recipe.prototype.cleanUp = function () {
    if (typeof (this.data.title) != "string") { this.data.title = ""; }
    if (typeof (this.data.instructions) != "string") { this.data.instructions = ""; }
    if (typeof (this.data.ingredients) != "object") { this.data.ingredients = []; }
    if (typeof (this.data.cookTime) != "string") { this.data.cookTime = ""; }
    if (typeof (this.data.tags) != "object") { this.data.tags = []; }

    let _id = this.data._id;

    this.data = {
        title: this.data.title.trim(),
        instructions: this.data.instructions.trim(),
        ingredients: this.data.ingredients,
        cookTime: this.data.cookTime,
        tags: this.data.tags,
        createdDate: this.updateMode ? this.data.createdDate : new Date()
    }

    if (this.updateMode) {
        this.data._id = _id;
    }
}

Recipe.prototype.validate = function () {
    return new Promise(async (resolve, reject) => {
        if (this.data.title == "") { this.errors.push("You must provide a title."); }
        if (this.data.ingredients == []) { this.errors.push("You must provide ingredients."); }
        if (this.data.instructions == "") { this.errors.push("You must provide instructions."); }
        if (this.data.cookTime == "") { this.errors.push("You must provide a cook time."); }

        resolve();
    });
}

Recipe.prototype.addRecipe = function () {
    return new Promise(async (resolve, reject) => {
        this.cleanUp();
        await this.validate();

        if (!this.errors.length) {
            try {
                await recipeCollection.insertOne(this.data);
                resolve();
            } catch (err) {
                reject(err);
            }
        } else {
            reject(this.errors);
        }
    });
}

Recipe.prototype.editRecipe = function () {
    return new Promise(async (resolve, reject) => {
        this.cleanUp();
        await this.validate();

        if (!this.errors.length) {
            try {
                await recipeCollection.updateOne({ _id: new ObjectId(this.data._id) }, { $set: {
                    title: this.data.title,
                    instructions: this.data.instructions,
                    ingredients: this.data.ingredients,
                    cookTime: this.data.cookTime,
                    tags: this.data.tags,
                    createdDate: this.data.createdDate
                } })
                resolve();
            } catch (err) {
                reject(err);
            }
        } else {
            reject(this.errors);
        }
    });
}

Recipe.prototype.deleteRecipe = function () {
    return new Promise(async (resolve, reject) => {
        try {
            await recipeCollection.deleteOne({ _id: new ObjectId(this.data._id) });
            resolve();
        } catch (err) {
            reject(err);
        }
    });
}

Recipe.prototype.getRecipes = function () {
    return new Promise(async (resolve, reject) => {
        let recipes = await recipeCollection.find().toArray();

        recipes = recipes.sort((a, b) => {
            return new Date(b.createdDate) - new Date(a.createdDate);
        });

        resolve(recipes);
    });
}

module.exports = Recipe;