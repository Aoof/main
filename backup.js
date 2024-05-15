const { MongoClient } = require("mongodb");
const fs = require("fs");
const https = require("https");
require("dotenv").config();

MongoClient.connect(process.env.MONGODBSTRING, 
{ useUnifiedTopology: true, useNewUrlParser: true },
async function(err, client) {
    let db = client.db("maindb");

    let recipesCollection = db.collection("recipes");

    let recipes = await recipesCollection.find().toArray();

    // Back up all recipes to a JSON file and save it by date
    let date = new Date();
    let dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    let backupPath = `backups/recipes-${dateString}.json`;

    fs.writeFileSync(backupPath, JSON.stringify(recipes, null, 2));

    await client.close();
    process.exit();
})
