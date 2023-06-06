const express = require("express");
const dashboard = require("../../controllers/dashboard/dashboard.controller");
const checkAuthMiddleWare = require("../../middleware/check_auth.middleware");
const router = express.Router();
const uploadFile = require("../../middleware/importFile.middleware");

router.get("/", (req, res) => {
    res.json({
        status: 200,
        message: "This is Dashboard api page!",
    });
});


router.get("/valvesCountForDashboard/:project_id/:state?", 
// checkAuthMiddleWare.checkToken, 
dashboard.valvesCountForDashboard);
router.get("/deviceStatusCountForDashboard/:project_id", checkAuthMiddleWare.checkToken, dashboard.deviceStatusCountForDashboard);
// sensor count
router.get("/analogCountForDashboard/:project_id", checkAuthMiddleWare.checkToken, dashboard.analogCountForDashboard); 
router.get("/totalFlowForDashboard/:project_id", checkAuthMiddleWare.checkToken, dashboard.totalFlowForDashboard);
router.get("/eneryStatusDashboard/:project_id", checkAuthMiddleWare.checkToken, dashboard.eneryStatusDashboard);
router.get("/getLiveProjectData",
 //checkAuthMiddleWare.checkToken,
 dashboard.getLiveProjectData);
 router.get("/getDigitInput/:project_id", dashboard.getDigitInput);



// details page api
router.post("/valvesDetailsByOmega", checkAuthMiddleWare.checkToken, dashboard.valvesDetailsByOmega);
router.post("/deviceStatusDetailsByOmega", checkAuthMiddleWare.checkToken, dashboard.deviceStatusDetailsByOmega);
router.post("/sensorDetailsByOmega", checkAuthMiddleWare.checkToken, dashboard.sensorDetailsByOmega);
router.post("/digitInputDetailsByOmega", dashboard.digitInputDetailsByOmega);

module.exports = router;