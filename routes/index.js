const express = require('express');
const router = express.Router();

const authRouter = require("./auth");
const appointmentsRouter = require("./appointments");

router.use("/auth", authRouter);
router.use("/appointments", appointmentsRouter);

module.exports = router;