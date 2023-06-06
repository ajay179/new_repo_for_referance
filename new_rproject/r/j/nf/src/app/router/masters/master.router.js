const express = require("express");
const master = require("../../controllers/masters/masters.controller");
const checkAuthMiddleWare = require("../../middleware/check_auth.middleware");
const router = express.Router();
const uploadFile = require("../../middleware/importFile.middleware");
router.get("/", (req, res) => {
  res.json({
    status: 200,
    message: "This is masters api page!",
  });
});
router.post(
  "/masterCreateUpdate",
  // checkAuthMiddleWare.checkToken,
  master.masterCreateUpdate
);

router.post(
  "/graphqlMasterCreateUpdate",
  checkAuthMiddleWare.checkToken,
  master.graphqlMasterCreateUpdate
);

router.post(
  "/profileCreateUpdate",
  checkAuthMiddleWare.checkToken,
  master.profileCreateUpdate
);
router.post(
  "/getMasterData",
  checkAuthMiddleWare.checkToken,
  master.getMasterData
);

router.post(
  "/getMasterList",
   checkAuthMiddleWare.checkToken,
  master.getMasterList
);
router.post(
  "/getMasterActiveAllData",
  checkAuthMiddleWare.checkToken,
  master.getMasterActiveAllData
);
router.post("/uploadImage", checkAuthMiddleWare.checkToken, master.uploadImage);
router.post("/mailSend", checkAuthMiddleWare.checkToken, master.mailSend);
router.post("/smsGateWay", checkAuthMiddleWare.checkToken, master.smsGateWay);
router.post("/validator", master.validator);
router.post("/importFile", uploadFile.single("file"), master.importFile);
router.post("/exportFile", checkAuthMiddleWare.checkToken, master.exportFile);
router.post("/getCityDataByStateId", master.getCityDataByStateId);
router.post(
  "/getDependentMasterList",
  checkAuthMiddleWare.checkToken,
  master.getDependentMasterList
);
router.post(
  "/uniqueNumber",
  checkAuthMiddleWare.checkToken,
  master.uniqueNumber
);
router.post(
  "/getUserTypeWiseAccess",
  checkAuthMiddleWare.checkToken,
  master.getUserTypeWiseAccess
);
router.post(
  "/getProjectWiseAccess",
  checkAuthMiddleWare.checkToken,
  master.getProjectWiseAccess
);

router.post(
  "/settingAccess",
  checkAuthMiddleWare.checkToken,
  master.settingAccess
);
router.post(
  "/getProjectTypeLevel",
  checkAuthMiddleWare.checkToken,
  master.getProjectTypeLevel
);
router.post(
  "/getOmegaFromBermadNew",
  //  checkAuthMiddleWare.checkToken,
  master.getOmegaFromBermadNew
);

router.post(
  "/getOmegaDetails",
  checkAuthMiddleWare.checkToken,
  master.getOmegaDetails
);

router.post(
  "/updateProjectWiseAccess",
  checkAuthMiddleWare.checkToken,
  master.updateProjectWiseAccess
);

router.post(
  "/getZoneSubZone",
  checkAuthMiddleWare.checkToken,
  master.getZoneSubZone
);

router.post("/getPrograms", checkAuthMiddleWare.checkToken, master.getPrograms);

router.post(
  "/getPrograms1",
  checkAuthMiddleWare.checkToken,
  master.getPrograms1
);

router.post(
  "/ProgramsSynchronise",
  // checkAuthMiddleWare.checkToken,
  master.ProgramsSynchronise
);

router.post(
  "/getFarmerDetails",
  checkAuthMiddleWare.checkToken,
  master.getFarmerDetails
);

router.post(
  "/deleteRecordById",
  checkAuthMiddleWare.checkToken,
  master.deleteRecordById
);

router.post(
  "/createOneProgram",
  checkAuthMiddleWare.checkToken,
  master.createOneProgram
);

router.post(
  "/updateOneProgram",
  checkAuthMiddleWare.checkToken,
  master.updateOneProgram
);

router.post(
  "/updateProgramstatus",
  checkAuthMiddleWare.checkToken,
  master.updateProgramstatus
);

router.post(
  "/deleteProgram",
  checkAuthMiddleWare.checkToken,
  master.deleteProgram
);

router.get(
  "/downloadProgram/:project_id",
  checkAuthMiddleWare.checkToken,
  master.downloadProgram
);

router.post(
  "/getUnitStatus",
  // checkAuthMiddleWare.checkToken,
  master.getUnitStatus
);

router.post(
  "/importCompleteFile",
  uploadFile.single("file"),
  master.importCompleteFile
);
router.post(
  "/startProgram",
  checkAuthMiddleWare.checkToken,
  master.startProgram
);

router.post(
  "/getUniqueOmegaIds",
  checkAuthMiddleWare.checkToken,
  master.getUniqueOmegaIds
);

router.post(
  "/startProgram",
  checkAuthMiddleWare.checkToken,
  master.startProgram
);

router.post("/startCycle", checkAuthMiddleWare.checkToken, master.startCycle);

router.post(
  "/getProjectDataByUserId",
  checkAuthMiddleWare.checkToken,
  master.getProjectDataByUserId
);

router.post("/stopProgram", checkAuthMiddleWare.checkToken, master.stopProgram);

router.post(
  "/pauseProgram",
  checkAuthMiddleWare.checkToken,
  master.pauseProgram
);

router.post("/getUnit", checkAuthMiddleWare.checkToken, master.getUnit);
router.post(
  "/getLogsSystem",
  checkAuthMiddleWare.checkToken,
  master.getLogsSystem
);

router.post(
  "/getOmegaMasterlist",
  // checkAuthMiddleWare.checkToken,
  master.getOmegaMasterlist
);

router.post(
  "/getFarmerProfilelist",
  checkAuthMiddleWare.checkToken,
  master.getFarmerProfilelist
);
router.post("/excelExport", checkAuthMiddleWare.checkToken, master.excelExport);
router.post(
  "/resumeProgram",
  checkAuthMiddleWare.checkToken,
  master.resumeProgram
);

router.post(
  "/liveMonitoring",
  // checkAuthMiddleWare.checkToken,
  master.liveMonitoring
);
router.post(
  "/inserUpdateSystemLog",
  checkAuthMiddleWare.checkToken,
  master.inserUpdateSystemLog
);
router.get(
  "/updateflowdata",
  checkAuthMiddleWare.checkToken,
  master.updateflowdata
);

router.get(
  "/exportSystemLogs/:from_date/:to_date/:project_id/:unit_id?/:alert_type?",
  master.exportSystemLogs
);
router.post(
  "/getOmegaFromBermad",
  //  checkAuthMiddleWare.checkToken,
  master.getOmegaFromBermad
);
router.post(
  "/messageSend",
  //  checkAuthMiddleWare.checkToken,
  master.messageSend
);
router.post(
  "/farmerMasterValvesAndSchedule",
  //  checkAuthMiddleWare.checkToken,
  master.farmerMasterValvesAndSchedule
);

router.post(
  "/getUnitStatusAPI",
  // checkAuthMiddleWare.checkToken,
  master.getUnitStatusAPI
);
module.exports = router;
