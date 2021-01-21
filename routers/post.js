const express = require("express");
const PostController = require("../controllers/post");

const md_auth = require("../middleware/authenticate");

const api = express.Router();

api.post("/add-post", PostController.addPost);
api.get("/get-posts", PostController.getPosts);
api.get("/get-post/:url", PostController.getPost);
api.put("/update-post/:id", [md_auth.ensureAdmin], PostController.updatePost);
api.delete("/delete-post/:id", [md_auth.ensureAdmin], PostController.deletePost);

module.exports = api;

//[md_auth.ensureAuth] [md_auth.ensureAdmin],