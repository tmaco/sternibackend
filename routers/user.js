const express = require("express");
const UserController = require("../controllers/user");
const multipart = require("connect-multiparty");

const md_auth = require("../middleware/authenticate");
const md_upload_avatar = multipart({uploadDir: "./uploads/avatar"});

const api = express.Router();

api.post("/sign-up", UserController.signUp);
api.post("/sign-in", UserController.signIn);
api.get("/users", [md_auth.ensureAdmin], UserController.getUsers);
api.get("/users-active", [md_auth.ensureAdmin], UserController.getUsersActive);
api.put("/upload-avatar/:id", [md_auth.ensureAdmin, md_upload_avatar], UserController.uploadAvatar);
api.get("/get-avatar/:avatarName", UserController.getAvatar);
api.put("/update-user/:id", [md_auth.ensureAdmin], UserController.updateUser);
api.put("/activate-user/:id", [md_auth.ensureAdmin], UserController.activateUser);
api.delete("/delete-user/:id", [md_auth.ensureAdmin], UserController.deleteUser);
api.post("/create-user", [md_auth.ensureAdmin], UserController.createUser);


module.exports = api;