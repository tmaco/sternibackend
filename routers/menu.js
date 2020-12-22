const express = require("express");
const MenuController = require("../controllers/menu");

const md_auth = require("../middleware/authenticate");


const api = express.Router();

api.post("/add-menu", [md_auth.ensureAdmin], MenuController.addMenu);
api.get("/get-menus", MenuController.getMenu);
api.put("/update-menu/:id", [md_auth.ensureAdmin], MenuController.updateMenu);
api.put("/activate-menu/:id", [md_auth.ensureAdmin], MenuController.activateMenu);
api.delete("/delete-menu/:id", [md_auth.ensureAdmin], MenuController.deleteMenu);

module.exports = api;