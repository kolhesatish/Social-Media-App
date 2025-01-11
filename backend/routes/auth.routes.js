import express from "express";
import { login, logout, signup } from "../controllers/auth.controllers.js";

const router = express.Router();

router.get("/signup", signup);

router.post("/login", login);

router.get("/logout", logout);


export default router;
