import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { createPost, deletePost, commentOnPost, likeUnlikePost, getAllPosts } from "../controllers/post.controller.js";

const router = express.Router();

router.post("/create", protectRoute, createPost);
 router.post("/like/:id", protectRoute, likeUnlikePost);
 router.post("/comment/:id", protectRoute, commentOnPost);
 router.delete("/:id", protectRoute, deletePost);
 router.get("/all", protectRoute, getAllPosts);

export default router;