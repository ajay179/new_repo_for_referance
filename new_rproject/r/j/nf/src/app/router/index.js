const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    status: 200,
    message: "This is api page!",
  });
});

router.use("/auth", require("./auth/index"));
router.use("/masters", require("./masters/master.router"));
router.use("/dashboards", require("./dashboard/dashboard.route"));
router.use("/reports", require("./report/report.route"));

module.exports = router;
