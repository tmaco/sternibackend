const express = require("express");
const PostController = require("../controllers/post");

const md_auth = require("../middleware/authenticate");

const api = express.Router();

api.post("/add-post", PostController.addPost);
api.get("/get-posts", PostController.getPost);
api.put("/update-post/:id", PostController.updatePost);

module.exports = api;

//[md_auth.ensureAuth]