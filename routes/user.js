'use strict'

const express = require("express");
const UserController = require("../controllers/user");

const router = express.Router();

router.post("/save",UserController.saveUser);

module.exports = router;