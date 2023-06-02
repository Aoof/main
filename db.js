const { MongoClient } = require("mongodb");
require("dotenv").config();

MongoClient.connect(process.env.MONGODBSTRING, 
                    { useUnifiedTopology: true, useNewUrlParser: true },
                    function(err, client) {
                        module.exports = client.db("maindb");
                        const app = require("./index");
                        app.listen(process.env.PORT || 8080);
                    })
