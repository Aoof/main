const router = require("express").Router();
const controller = require("./controllers/main");

router.get('/', controller.home);

module.exports = router;