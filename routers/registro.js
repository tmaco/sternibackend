const express = require("express");
const RegistroController = require("../controllers/registro");

const api = express.Router();

api.get("/registros", RegistroController.getRegistros);


module.exports = api;