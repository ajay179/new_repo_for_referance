const express = require("express");
const report = require("../../controllers/report/report.controller");
const checkAuthMiddleWare = require("../../middleware/check_auth.middleware");
const router = express.Router();
const uploadFile = require("../../middleware/importFile.middleware");

router.get("/", (req, res) => {
    res.json({
        status: 200,
        message: "This is Report api page!",
    });
});


router.post("/irrigationLog", report.irrigationLog);
router.post("/getLogsPower", report.getLogsPower);
router.post("/getLogsAnalog", report.getLogsAnalog);
router.post("/getLogsWaterMeterTs", report.getLogsWaterMeterTs);
router.post("/getLogsValveTs", report.getLogsValveTs);

// export 
router.get("/exportIrrigationLog/:pid/:uid/:from/:to", report.exportIrrigationLog);
router.get("/exportGetLogsPower/:pid/:uid/:from/:to", report.exportGetLogsPower);
router.get("/exportGetLogsAnalog/:pid/:uid/:from/:to/:timeSlice?", report.exportGetLogsAnalog);
router.get("/exportGetLogsWaterMeterTs/:pid/:uid/:from/:to/:timeSlice?/:entityType?", report.exportGetLogsWaterMeterTs);
router.get("/exportGetLogsValveTs/:pid/:uid/:timeSlice?", report.exportGetLogsValveTs);


module.exports = router;