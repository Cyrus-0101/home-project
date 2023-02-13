import express from "express";
import {
  login,
  logout,
  refresh,
  signup,
} from "../controllers/authControllers.js";

const router = express.Router();

router.route("/");

router.route("/signup").post(signup);

router.route("/login").post(login);

router.route("/refresh").get(refresh);

router.route("/logout").post(logout);

export default router;
