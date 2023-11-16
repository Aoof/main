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
    if (typeof (this.data.cookTime) != "number") { this.data.cookTime = 0; }
    if (typeof (this.data.tags) != "object") { this.data.tags = []; }

    // get rid of any bogus properties
    this.data = {
        title: this.data.title.trim(),
        instructions: this.data.instructions.trim(),
        ingredients: this.data.ingredients,
        cookTime: this.data.cookTime,
        tags: this.data.tags,
        createdDate: this.updateMode ? this.data.createdDate : new Date()
    }

    if (this.updateMode) {
        this.data._id = ObjectId(this.data._id);
    }
}

Recipe.prototype.validate = function () {
    return new Promise(async (resolve, reject) => {
        if (this.data.title == "") { this.errors.push("You must provide a title."); }
        if (this.data.ingredients == []) { this.errors.push("You must provide ingredients."); }
        if (this.data.instructions == "") { this.errors.push("You must provide instructions."); }
        if (this.data.cookTime == 0) { this.errors.push("You must provide a cook time."); }

        resolve();
    });
}

Recipe.prototype.addRecipe = function () {
    new Promise(async (resolve, reject) => {
        this.cleanUp();
        await this.validate();

        if (!this.errors.length) {
            recipeCollection.insertOne(this.data);
            resolve();
        } else {
            reject(this.errors);
        }
    });
}

Recipe.prototype.editRecipe = function () {
    new Promise(async (resolve, reject) => {
        this.cleanUp();
        await this.validate();

        if (!this.errors.length) {
            recipeCollection.updateOne({ _id: this.data._id }, { $set: this.data })
            resolve();
        } else {
            reject(this.errors);
        }
    });
}

Recipe.prototype.deleteRecipe = function () {
    new Promise(async (resolve, reject) => {
        this.cleanUp();
        await this.validate();

        if (!this.errors.length) {
            recipeCollection.deleteOne({ _id: this.data._id });
            resolve();
        } else {
            reject(this.errors);
        }
    });
}

Recipe.prototype.getRecipes = function () {
    return new Promise(async (resolve, reject) => {
        let recipes = await recipeCollection.find().toArray();
        resolve(recipes);
    });
}

module.exports = Recipe;