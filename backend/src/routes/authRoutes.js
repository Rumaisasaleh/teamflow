const express = require("express");
const { login, me } = require("../controllers/authController.js");
const { auth } = require("../middleware/auth.js");

const router = express.Router();

router.post("/login", login);
router.get("/me", auth(), me);

module.exports = router;
