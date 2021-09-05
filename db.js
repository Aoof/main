const { MongoClient } = require("mongodb");
require("dotenv").config();

MongoClient.connect(process.env.MONGODBSTRING, 
                    { useUnifiedTopology: true, useNewUrlParser: true },
                    function(err, client) {
                        module.exports = client;

                        require("./index").listen(process.env.PORT || 8080);
                    })
