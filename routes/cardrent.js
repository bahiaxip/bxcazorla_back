"use strict"

const express = require("express");
const CardRentController = require("../controllers/cardrent");
const router = express.Router();

router.get("/",CardRentController.hola);
module.exports = router;
