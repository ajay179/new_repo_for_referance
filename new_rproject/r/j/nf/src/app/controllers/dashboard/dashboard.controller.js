const Model = require("../../models");
var response = require("../../middleware/response.middleware");
const { parse } = require("json2csv");

exports.valvesCountForDashboard = (req, res) => {
  const project_id = req.params.project_id;
  var state = "";
  if (req.params.state != undefined) {
    state = req.params.state;
  }
  if (!project_id) {
    return response.fail(res, "Project Id Required!", "");
  }
  Model.devices_master
    .findAll({
      where: { project_id: project_id, active: 1 },
      order: [["id", "DESC"]],
    })
    .then((deviceMasterResponse) => {
      if (deviceMasterResponse.length > 0) {
        // omega call back function
        var index = 0;
        exports.omegaDataFunction(
          index,
          deviceMasterResponse,
          function (omegaDataResponseData) {
            var totalOpenCount = 0;
            var totalCloseCount = 0;
            var totalOpenWithAlertCount = 0;
            omegaDataResponseData.forEach((item) => {
              if (item.openCount != undefined) {
                totalOpenCount = totalOpenCount + item.openCount;
              }
              if (item.closeCount != undefined) {
                totalCloseCount = totalCloseCount + item.closeCount;
              }
              if (item.openWithAlertCount != undefined) {
                totalOpenWithAlertCount =
                  totalOpenWithAlertCount + item.openWithAlertCount;
              }
            });
            var color = [];
            var valvesResponse = [];
            if (totalOpenCount != 0) {
              color.push("#558bff"); // color blue
              valvesResponse.push({ x: totalOpenCount, y: totalOpenCount, status: "open" });
            }
            if (totalCloseCount != 0) {
              color.push("#8b8b8b"); // color dark gray
              valvesResponse.push({ x: totalCloseCount, y: totalCloseCount, status: "close" });
            }
            if (totalOpenWithAlertCount != 0) {
              color.push("#ff675a"); // color red
              valvesResponse.push({
                x: totalOpenWithAlertCount,
                y: totalOpenWithAlertCount,
                status: "openWithAlert"
              });
            }
            var data = { valvesResponse, color };
            return response.success(res, "Success", data);
            // return response.success(res, "Success", data);
          }
        );
      } else {
        return response.fail(res, "No Data Found!", "");
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.omegaDataFunction = (index, deviceMasterResponse, callback) => {
  const stringifyData = JSON.stringify(deviceMasterResponse);
  const parseData = JSON.parse(stringifyData);
  var dataLength = parseData.length;
  if (parseFloat(dataLength) === 0) {
    callback(1);
    return;
  }
  var singleItemData = parseData[index];
  Model.live_monitoring
    .findAll({
      where: { omega_id: singleItemData.omega_id },
    })
    .then((liveMonitoringResponse) => {
      if (liveMonitoringResponse.length > 0) {
        var valves = liveMonitoringResponse[0].valves;
        if (valves != null) {
          var closeCount = 0;
          var openCount = 0;
          var openWithAlertCount = 0;
          for (let i = 0; i < valves.length; i++) {
            var state = valves[i].state;
            var error = valves[i].error;
            if (state == "open" && error != null) {
              openWithAlertCount = openWithAlertCount + 1;
            } else if (state == "open") {
              openCount = openCount + 1;
            } else if (state == "close") {
              closeCount = closeCount + 1;
            }
          }
          parseData[index].closeCount = closeCount;
          parseData[index].openCount = openCount;
          parseData[index].openWithAlertCount = openWithAlertCount;
          //// increment
          index = parseInt(index) + 1;
          if (parseFloat(index) < parseFloat(dataLength)) {
            exports.omegaDataFunction(index, parseData, callback);
          } else {
            callback(parseData);
          }
        } else {
          //// increment
          index = parseInt(index) + 1;
          if (parseFloat(index) < parseFloat(dataLength)) {
            exports.omegaDataFunction(index, parseData, callback);
          } else {
            callback(parseData);
          }
        }
      } else {
        //// increment
        index = parseInt(index) + 1;
        if (parseFloat(index) < parseFloat(dataLength)) {
          exports.omegaDataFunction(index, deviceMasterResponse, callback);
        } else {
          callback(parseData);
        }
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.deviceStatusCountForDashboard = (req, res) => {
  const project_id = req.params.project_id;
  Model.live_monitoring
    .findAll({
      where: { project_id: project_id },
      order: [["id", "DESC"]],
    })
    .then((liveMonitoringResponse) => {
      var online = 0;
      var offline = 0;
      liveMonitoringResponse.forEach((item) => {
        var isonline = item.isonline;
        if (isonline == true) {
          online = online + 1;
        } else {
          offline = offline + 1;
        }
      });
      //
      var color = [];
      var deviceStatusResponse = [];
      if (online != 0) {
        color.push("#558bff"); // color blue
        deviceStatusResponse.push({ x: online, y: online, status: true });
      }
      if (offline != 0) {
        color.push("#d0d0d0"); // color light gray
        deviceStatusResponse.push({ x: offline, y: offline, status: false });
      }
      var data = { deviceStatusResponse, color };
      //
      return response.success(res, "Success", data);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.analogCountForDashboard = (req, res) => {
  const project_id = req.params.project_id;
  Model.live_monitoring
    .findAll({
      where: { project_id: project_id, type: 2 },
      order: [["id", "DESC"]],
    })
    .then((liveMonitoringResponse) => {
      if (liveMonitoringResponse.length > 0) {
        var analogData = liveMonitoringResponse[0].analogs;
        // callback function
        var index = 0;
        exports.liveMonitoringDataFunction(
          index,
          analogData,
          function (liveMonitoringDataResponseData) {
            var okCount = 0;
            var lowAlertCount = 0;
            var highAlertCount = 0;
            var okCount2 = 0;
            var lowAlertCount2 = 0;
            var highAlertCount2 = 0;
            liveMonitoringDataResponseData.forEach((item) => {
              okCount += item.okCount;
              lowAlertCount += item.lowAlertCount;
              highAlertCount += item.highAlertCount;
              okCount2 += item.okCount2;
              lowAlertCount2 += item.lowAlertCount2;
              highAlertCount2 += item.highAlertCount2;
            });
            ////
            var colorForAnalogStatus1 = [];
            var colorForAnalogStatus2 = [];
            var analogStatus1 = [];
            var analogStatus2 = [];
            if (okCount != 0) {
              colorForAnalogStatus1.push("#8b8b8b");
              analogStatus1.push({ x: okCount, y: okCount, status: 0 });
            }
            if (lowAlertCount != 0) {
              colorForAnalogStatus1.push("#558bff");
              analogStatus1.push({ x: lowAlertCount, y: lowAlertCount, status: 1 });
            }
            if (highAlertCount != 0) {
              colorForAnalogStatus1.push("#558bff");
              analogStatus1.push({ x: highAlertCount, y: highAlertCount, status: 2 });
            }
            if (okCount2 != 0) {
              colorForAnalogStatus2.push("#8b8b8b");
              analogStatus2.push({ x: okCount2, y: okCount2, status: 0 });
            }
            if (lowAlertCount2 != 0) {
              colorForAnalogStatus2.push("#558bff");
              analogStatus2.push({ x: lowAlertCount2, y: lowAlertCount2, status: 1 });
            }
            if (highAlertCount2 != 0) {
              colorForAnalogStatus2.push("#558bff");
              analogStatus2.push({ x: highAlertCount2, y: highAlertCount2, status: 2 });
            }
            var data = {
              analogStatus1,
              analogStatus2,
              colorForAnalogStatus1,
              colorForAnalogStatus2,
            };
            return response.success(res, "Success", data);
          }
        );
      } else {
        return response.fail(res, "No Data Found!", "");
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.liveMonitoringDataFunction = (index, analogData, callback) => {
  const stringifyData = JSON.stringify(analogData);
  const parseData = JSON.parse(stringifyData);
  var dataLength = parseData.length;
  if (parseFloat(dataLength) === 0) {
    callback(1);
    return;
  }
  var item = parseData[index];
  var okCount = 0;
  var lowAlertCount = 0;
  var highAlertCount = 0;
  var okCount2 = 0;
  var lowAlertCount2 = 0;
  var highAlertCount2 = 0;
  if (item.index == 1) {
    if (item.status == 0) {
      okCount = 1;
    } else if (item.status == 1) {
      lowAlertCount = 1;
    } else if (item.status == 2) {
      highAlertCount = 1;
    }
  } else {
    if (item.status == 0) {
      okCount2 = 1;
    } else if (item.status == 1) {
      lowAlertCount2 = 1;
    } else if (item.status == 2) {
      highAlertCount2 = 1;
    }
  }

  parseData[index].okCount = okCount;
  parseData[index].lowAlertCount = lowAlertCount;
  parseData[index].highAlertCount = highAlertCount;
  parseData[index].okCount2 = okCount2;
  parseData[index].lowAlertCount2 = lowAlertCount2;
  parseData[index].highAlertCount2 = highAlertCount2;
  //// increment
  index = parseInt(index) + 1;
  if (parseFloat(index) < parseFloat(dataLength)) {
    exports.liveMonitoringDataFunction(index, parseData, callback);
  } else {
    callback(parseData);
  }
};

exports.totalFlowForDashboard = (req, res) => {
  const project_id = req.params.project_id;
  Model.devices_master
    .findAll({
      where: { project_id: project_id },
      order: [["id", "ASC"]],
    })
    .then((deviceMasterResponse) => {
      Model.live_monitoring
        .findAll({
          where: { project_id: project_id },
          order: [["id", "DESC"]],
        })
        .then((liveMonitoringResponse) => {
          var index = 0;
          var count = 0;
          var liveIndex = 0;
          var liveCount = 0;
          exports.deviceDetailsFunction(
            index,
            project_id,
            count,
            deviceMasterResponse,
            function (deviceMasteresponseData) {
              exports.liveMonitoringTotalFlowFunction(
                liveIndex,
                liveCount,
                liveMonitoringResponse,
                function (liveMonitoringResponseData) {
                  res.json({
                    status: 200,
                    code: 1,
                    message: "success",
                    data: {
                      total_flow: deviceMasteresponseData,
                      actual_flow: liveMonitoringResponseData,
                    },
                  });
                }
              );
            }
          );
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.deviceDetailsFunction = async (
  index,
  project_id,
  count,
  deviceMasterResponse,
  callback
) => {
  const stringifyData = JSON.stringify(deviceMasterResponse);
  const parseData = JSON.parse(stringifyData);
  var dataLength = parseData.length;
  if (parseFloat(dataLength) === 0) {
    callback(1);
    return;
  }
  var singleItemData = parseData[index];
  var livemonitoringResponse = await Model.live_monitoring.findAll(
    {
      attributes: ["device_id", "valves"],
      where: { project_id: project_id },
    },
    { type: Model.sequelize.QueryTypes.SELECT }
  );

  var countindex = 0;
  exports.nominalCountFunction(
    countindex,
    livemonitoringResponse,
    function (responseDataArray) {
      if (responseDataArray != 1) {
        var countData = 0;
        responseDataArray.forEach((item) => {
          if (item.nominalflowcount != undefined) {
            countData = countData + Number(item.nominalflowcount);
          }
        });
        callback(countData);
      }
    }
  );
};

exports.nominalCountFunction = async (
  index,
  livemonitoringResponse,
  callback
) => {
  const stringifyData = JSON.stringify(livemonitoringResponse);
  const parseData = JSON.parse(stringifyData);
  var dataLength = parseData.length;
  if (parseFloat(dataLength) === 0) {
    index = parseInt(index) + 1;
    if (parseFloat(index) < parseFloat(dataLength)) {
      exports.nominalCountFunction(index, parseData, callback);
    } else {
      callback(parseData);
    }
    return;
  }
  var singleItemData = parseData[index]; //// increment
  //////////////
  var inputIndexIn = [];
  var deviceArrayIn = [];
  var vavlesArray = singleItemData.valves;
  deviceArrayIn.push(singleItemData.device_id);
  if (vavlesArray != null) {
    for (let k = 0; k < vavlesArray.length; k++) {
      if (vavlesArray[k].state == "open") {
        inputIndexIn.push(vavlesArray[k].index);
      }
    }
  }

  //var inputIndexInArray = inputIndexIn.map((i) => i.toString());
  //var deviceArrayInArray = deviceArrayIn.map((i) => i.toString());
  if (inputIndexIn.length > 0 && deviceArrayIn.length > 0) {
    var inputIndexInArray = "";
    for (let j = 0; j < inputIndexIn.length; j++) {
      if (j == 0) {
        inputIndexInArray = "'" + inputIndexIn[j] + "'";
      } else {
        inputIndexInArray += "," + "'" + inputIndexIn[j] + "'";
      }
    }
    var deviceArrayInArray = "";
    for (let v = 0; v < deviceArrayIn.length; v++) {
      if (v == 0) {
        deviceArrayInArray = "'" + deviceArrayIn[v] + "'";
      } else {
        deviceArrayInArray += "," + "'" + deviceArrayIn[v] + "'";
      }
    }
    var sql = `select sum(flow) as nominalflowcount from devices_details where type=1 and input_index IN ( ${inputIndexInArray} ) and device_id IN (${deviceArrayInArray})`;

    Model.sequelize
      .query(sql, {
        type: Model.sequelize.QueryTypes.SELECT,
      })
      .then(function (deviceDetailsResponse) {
        if (deviceDetailsResponse.length > 0) {
          parseData[index].nominalflowcount =
            deviceDetailsResponse[0].nominalflowcount;
          /////////////
          index = parseInt(index) + 1;
          if (parseFloat(index) < parseFloat(dataLength)) {
            exports.nominalCountFunction(index, parseData, callback);
          } else {
            callback(parseData);
          }
        } else {
          index = parseInt(index) + 1;
          if (parseFloat(index) < parseFloat(dataLength)) {
            exports.nominalCountFunction(index, parseData, callback);
          } else {
            callback(parseData);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    index = parseInt(index) + 1;
    if (parseFloat(index) < parseFloat(dataLength)) {
      exports.nominalCountFunction(index, parseData, callback);
    } else {
      callback(parseData);
    }
  }
};

exports.compareLiveMonitoringAndDeviceDetailsFunction = (
  index,
  count,
  deviceDetailsResponse,
  liveMonitoringResponse,
  callback
) => {
  const liveMonitoringStringifyData = JSON.stringify(liveMonitoringResponse);
  const liveMonitoringParseData = JSON.parse(liveMonitoringStringifyData);
  var liveMonitoringDataLength = liveMonitoringParseData.length;
  if (parseFloat(liveMonitoringDataLength) === 0) {
    callback(1);
    return;
  }
  var liveMonitoringSingleItemData = liveMonitoringParseData[index];
  var vavlesArray = liveMonitoringSingleItemData.valves;
  //return false;
  if (vavlesArray != null) {
    for (let j = 0; j < deviceDetailsResponse.length; j++) {
      for (let i = 0; i < vavlesArray.length; i++) {
        if (vavlesArray[i].state == "open") {
          if (vavlesArray[i].index == deviceDetailsResponse[j].input_index) {
            count = count + deviceDetailsResponse[j].flow;
          }
        }
      }
    }
  }

  //// increment
  index = parseInt(index) + 1;
  if (parseFloat(index) < parseFloat(liveMonitoringDataLength)) {
    exports.compareLiveMonitoringAndDeviceDetailsFunction(
      index,
      count,
      deviceDetailsResponse,
      liveMonitoringResponse,
      callback
    );
  } else {
    callback(count);
  }
};
exports.liveMonitoringTotalFlowFunction = (
  liveIndex,
  liveCount,
  liveMonitoringResponse,
  callback
) => {
  const stringifyData = JSON.stringify(liveMonitoringResponse);
  const parseData = JSON.parse(stringifyData);
  var dataLength = parseData.length;
  if (parseFloat(dataLength) === 0) {
    callback(1);
    return;
  }
  var singleItemData = parseData[liveIndex];
  var watermeter = singleItemData.watermeter;
  if (watermeter != null) {
    watermeter.forEach((item1) => {
      if (item1.index == 1 || item1.index == 2) {
        liveCount = liveCount + item1.flow;
      }
    });
    //// increment
    liveIndex = parseInt(liveIndex) + 1;
    if (parseFloat(liveIndex) < parseFloat(dataLength)) {
      exports.liveMonitoringTotalFlowFunction(
        liveIndex,
        liveCount,
        liveMonitoringResponse,
        callback
      );
    } else {
      callback(liveCount);
    }
  } else {
    //// increment
    liveIndex = parseInt(liveIndex) + 1;
    if (parseFloat(liveIndex) < parseFloat(dataLength)) {
      exports.liveMonitoringTotalFlowFunction(
        liveIndex,
        liveCount,
        liveMonitoringResponse,
        callback
      );
    } else {
      callback(liveCount);
    }
  }
};

// energy status dashboard
exports.eneryStatusDashboard = (req, res) => {
  const project_id = req.params.project_id;
  Model.devices_master
    .findAll({
      where: { project_id: project_id },
      order: [["id", "ASC"]],
    })
    .then((deviceMasterResponse) => {
      if (deviceMasterResponse.length > 0) {
        // callback function
        var index = 0;
        var lowBatteryCount = 0;
        var creticalLowBatteryCount = 0;
        exports.deviceMasterSystemLogFunction(
          index,
          lowBatteryCount,
          creticalLowBatteryCount,
          deviceMasterResponse,
          function (deviceMasterSystemLogResponseData) {
            var lowBatteryCount =
              deviceMasterSystemLogResponseData.lowBatteryCount;
            var creticalLowBatteryCount =
              deviceMasterSystemLogResponseData.creticalLowBatteryCount;
            var color = [];
            var energyStatusResponse = [];
            if (lowBatteryCount != 0) {
              color.push("#8b8b8b"); // color dark gray
              energyStatusResponse.push({
                x: lowBatteryCount,
                y: lowBatteryCount,
              });
            }
            if (creticalLowBatteryCount != 0) {
              color.push("#ff675a"); // color red
              energyStatusResponse.push({
                x: creticalLowBatteryCount,
                y: creticalLowBatteryCount,
              });
            }
            var data = { energyStatusResponse, color };
            return response.success(res, "Success", data);
          }
        );
      } else {
        return response.fail(res, "No Data Found", "");
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.deviceMasterSystemLogFunction = (
  index,
  lowBatteryCount,
  creticalLowBatteryCount,
  deviceMasterResponse,
  callback
) => {
  const stringifyData = JSON.stringify(deviceMasterResponse);
  const parseData = JSON.parse(stringifyData);
  var dataLength = parseData.length;
  if (parseFloat(dataLength) === 0) {
    callback(1);
    return;
  }
  var singleItemData = parseData[index];
  var unit_id = singleItemData.omega_id;
  // var unit_id = 'cla8fi4ts74900yw64bj1tjlp'
  Model.system_logs
    .findAll({
      where: { unit_id: unit_id },
      order: [["id", "ASC"]],
    })
    .then((systemLogResponse) => {
      if (systemLogResponse.length > 0) {
        systemLogResponse.forEach((item) => {
          if (item.line == "low_battery") {
            lowBatteryCount = Number(lowBatteryCount) + 1;
          }
          if (item.line == "critical_low_battery") {
            creticalLowBatteryCount = Number(creticalLowBatteryCount) + 1;
          }
        });
        //// increment
        index = parseInt(index) + 1;
        if (parseFloat(index) < parseFloat(dataLength)) {
          exports.deviceMasterSystemLogFunction(
            index,
            lowBatteryCount,
            creticalLowBatteryCount,
            deviceMasterResponse,
            callback
          );
        } else {
          callback({
            lowBatteryCount: lowBatteryCount,
            creticalLowBatteryCount: creticalLowBatteryCount,
          });
        }
      } else {
        //// increment
        index = parseInt(index) + 1;
        if (parseFloat(index) < parseFloat(dataLength)) {
          exports.deviceMasterSystemLogFunction(
            index,
            lowBatteryCount,
            creticalLowBatteryCount,
            deviceMasterResponse,
            callback
          );
        } else {
          callback({
            lowBatteryCount: lowBatteryCount,
            creticalLowBatteryCount: lowBatteryCount,
          });
        }
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

//
exports.getLiveProjectData = async (req, res) => {
  var projectMasterResponse = await Model.project.findAll(
    {
      attributes: ["id", "project_code", "project_name"],
      order: [["id", "DESC"]],
    },
    { type: Model.sequelize.QueryTypes.SELECT }
  );
  // callback function
  var index = 0;
  exports.getLiveProjectDataFunction(
    index,
    projectMasterResponse,
    function (dotNetResponseData) {
      var data = dotNetResponseData;
      return response.success(res, "Success!", data);
    }
  );
};

exports.getLiveProjectDataFunction = (
  indexs,
  projectMasterResponse,
  callback
) => {
  const stringifyData = JSON.stringify(projectMasterResponse);
  const parseData = JSON.parse(stringifyData);
  var dataLength = parseData.length;
  if (parseFloat(dataLength) === 0) {
    callback(1);
    return;
  }
  var singleItemData = parseData[indexs];
  //
  var project_id = singleItemData.id;
  Model.devices_master
    .findAll({
      where: { project_id: project_id },
    })
    .then((deviceMasterResponse) => {
      // console.log("deviceMasterResponse--", deviceMasterResponse);
      // return false;
      Model.live_monitoring
        .findAll({
          where: { project_id: project_id },
        })
        .then((liveMonitoringResponse) => {
          if (deviceMasterResponse.length > 0) {
            var index = 0;
            var count = 0;
            var liveIndex = 0;
            var liveCount = 0;
            var openCountIndex = 0;
            exports.deviceDetailsFunction(
              index,
              project_id,
              count,
              deviceMasterResponse,
              function (deviceMasteresponseData) {
                exports.liveMonitoringTotalFlowFunction(
                  liveIndex,
                  liveCount,
                  liveMonitoringResponse,
                  function (liveMonitoringResponseData) {
                    exports.omegaDataFunction(
                      openCountIndex,
                      deviceMasterResponse,
                      function (omegaDataResponseData) {
                        var totalOpenCount = 0;
                        if (omegaDataResponseData != 1) {
                          omegaDataResponseData.forEach((item) => {
                            if (item.openCount != undefined) {
                              totalOpenCount =
                                totalOpenCount +
                                Number(item.openCount) +
                                Number(item.openWithAlertCount);
                            }
                          });
                        }
                        parseData[indexs].openValveCount = totalOpenCount;
                        parseData[indexs].totalNominalFlow =
                          deviceMasteresponseData;
                        parseData[indexs].waterflowActual =
                          liveMonitoringResponseData;
                        //// increment
                        indexs = parseInt(indexs) + 1;
                        if (parseFloat(indexs) < parseFloat(dataLength)) {
                          exports.getLiveProjectDataFunction(
                            indexs,
                            parseData,
                            callback
                          );
                        } else {
                          callback(parseData);
                        }
                      }
                    );
                  }
                );
              }
            );
          } else {
            parseData[indexs].openValveCount = 0;
            parseData[indexs].totalNominalFlow = 0;
            parseData[indexs].waterflowActual = 0;
            //// increment
            indexs = parseInt(indexs) + 1;
            if (parseFloat(indexs) < parseFloat(dataLength)) {
              exports.getLiveProjectDataFunction(indexs, parseData, callback);
            } else {
              callback(parseData);
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
  //
};


exports.valvesDetailsByOmega = (req, res) => {
  const project_id = req.body.project_id;
  const state = req.body.state;

  if (!project_id) {
    return response.fail(res, "Project Id Required!", "");
  }
  Model.devices_master
    .findAll({
      where: { project_id: project_id, active: 1 },
      order: [["id", "DESC"]],
    })
    .then((deviceMasterResponse) => {
      if (deviceMasterResponse.length > 0) {
        // omega call back function
        var index = 0;
        var temp = []
        exports.valvesDetailsByOmegaFunction(
          index,
          temp,
          state,
          project_id,
          deviceMasterResponse,
          function (omegaDataResponseData) {
            return response.success(res, "Valves Details By Omega Id!", omegaDataResponseData);
          }
        );
      } else {
        return response.success(res, "No Data Found!", "");
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.valvesDetailsByOmegaFunction = async (
  index,
  temp,
  state,
  project_id,
  deviceMasterResponse,
  callback
) => {
  const stringifyData = JSON.stringify(deviceMasterResponse);
  const parseData = JSON.parse(stringifyData);
  var dataLength = parseData.length;
  if (parseFloat(dataLength) === 0) {
    callback(1);
    return;
  }
  var singleItemData = parseData[index];
  var device_id = singleItemData.id;
  Model.sequelize.query(`select device_id, isOnline, valves from live_monitorings where project_id = '${project_id}' AND device_id = '${device_id}'`, {
    type: Model.sequelize.QueryTypes.SELECT,
  }).then((liveMonitoringsDataResponse) => {
    if (liveMonitoringsDataResponse.length > 0) {
      Model.sequelize.query(`select dm.omega_id, dm.device_name, dd.* from devices_details as dd
      left join devices_masters as dm on dm.id = dd.device_id::integer
      where dd.type = 1 and dd.device_id ='${device_id}'`, {
        type: Model.sequelize.QueryTypes.SELECT,
      }).then((deviceDetailsDataResponse) => {
        if (deviceDetailsDataResponse.length > 0) {
          var valvesArray = liveMonitoringsDataResponse[0].valves
          if (valvesArray != null) {
            for (let j = 0; j < valvesArray.length; j++) {
              var valvesIndex = valvesArray[j].index
              for (let k = 0; k < deviceDetailsDataResponse.length; k++) {
                var deviceDetails = deviceDetailsDataResponse[k]
                var deviceDetailIndex = deviceDetailsDataResponse[k].input_index
                var stateCondition = ""
                var stateAndCondition = ""
                if (state != "close") {
                  stateCondition = "open"
                  stateAndCondition = state == "openWithAlert" ? null : ""
                } else {
                  stateCondition = "close"
                }
                if (valvesArray[j].state == stateCondition && valvesArray[j].error != stateAndCondition) {
                  if (valvesIndex == deviceDetailIndex) {
                    deviceDetails.state = state
                    if (state == "openWithAlert") {
                      deviceDetails.error = valvesArray[j].error
                    }
                    temp.push(deviceDetails)
                  }
                }
              }
            }
          }
          //// increment  
          index = parseInt(index) + 1;
          if (parseFloat(index) < parseFloat(dataLength)) {
            exports.valvesDetailsByOmegaFunction(index, temp, state,
              project_id, deviceMasterResponse, callback);
          } else {
            callback(temp);
          }
        } else {
          //// increment  
          index = parseInt(index) + 1;
          if (parseFloat(index) < parseFloat(dataLength)) {
            exports.valvesDetailsByOmegaFunction(index, temp, state,
              project_id, deviceMasterResponse, callback);
          } else {
            callback(1);
          }
        }
      }).catch(err => {
        console.log(err)
      })
    } else {
      //// increment  
      index = parseInt(index) + 1;
      if (parseFloat(index) < parseFloat(dataLength)) {
        exports.valvesDetailsByOmegaFunction(index,
          project_id, deviceMasterResponse, callback);
      } else {
        callback(1);
      }
    }
  }).catch(err => {
    console.log(err);
  })
};

exports.deviceStatusDetailsByOmega = (req, res) => {
  const project_id = req.body.project_id;
  const isOnline = req.body.isOnline; // isOnline true or false
  if (!project_id) {
    return response.fail(res, "Project Id Required!", "");
  }
  Model.devices_master.findAll({
    where: { project_id: project_id, active: 1 },
    order: [["id", "DESC"]],
  }).then((deviceMasterResponse) => {
    if (deviceMasterResponse.length > 0) {
      var index = 0;
      var temp = []
      exports.deviceStatusDetailsByOmegaFunction(index, temp, isOnline, deviceMasterResponse, function (deviceStatusDetailsByOmegaResponseData) {
        return response.success(res, "Device Details By Omega Id!", deviceStatusDetailsByOmegaResponseData);
      });
    } else {
      return response.fail(res, "No Data Found!", "");
    }
  }).catch(err => {
    console.log(err);
  })
}
exports.deviceStatusDetailsByOmegaFunction = (index, temp, isOnline, deviceMasterResponse, callback) => {
  const stringifyData = JSON.stringify(deviceMasterResponse);
  const parseData = JSON.parse(stringifyData);
  var dataLength = parseData.length;
  if (parseFloat(dataLength) === 0) {
    callback(1);
    return;
  }
  var singleItemData = parseData[index];
  var project_id = singleItemData.project_id;
  var device_id = singleItemData.id;
  Model.sequelize.query(`select device_id, isOnline, valves from live_monitorings where project_id = '${project_id}' AND device_id = '${device_id}'`, {
    type: Model.sequelize.QueryTypes.SELECT,
  }).then((liveMonitoringsDataResponse) => {
    if (liveMonitoringsDataResponse.length > 0) {
      var isonline = liveMonitoringsDataResponse[0].isonline
      var status = "Offline";
      if (isOnline == true) {
        status = "Online";
      }
      if (isonline == isOnline) {
        singleItemData.status = status
        temp.push(singleItemData)
      }
      //// increment  
      index = parseInt(index) + 1;
      if (parseFloat(index) < parseFloat(dataLength)) {
        exports.deviceStatusDetailsByOmegaFunction(index, temp, isOnline, deviceMasterResponse, callback);
      } else {
        callback(temp);
      }
    } else {
      //// increment  
      index = parseInt(index) + 1;
      if (parseFloat(index) < parseFloat(dataLength)) {
        exports.deviceStatusDetailsByOmegaFunction(index, temp, isOnline, deviceMasterResponse, callback);
      } else {
        callback(1);
      }
    }
  }).catch(err => {
    console.log(err)
  })
}

exports.sensorDetailsByOmega = (req, res) => {
  const project_id = req.body.project_id;
  const status = req.body.status; // isOnline true or false
  Model.devices_master.findAll({
    where: { project_id: project_id, active: 1 },
    order: [["id", "DESC"]],
  }).then((deviceMasterResponse) => {
    if (deviceMasterResponse.length > 0) {
      var index = 0;
      var temp = []
      exports.sensorDetailsByOmegaFunction(index, temp, status, deviceMasterResponse, function (sensorDetailsByOmegaResponseData) {
        return response.success(res, "Device Details By Omega Id!", sensorDetailsByOmegaResponseData);
      });
    } else {
      return response.fail(res, "No Data Found!", "");
    }
  }).catch(err => {
    console.log(err);
  })
}
exports.sensorDetailsByOmegaFunction = (index, temp, status, deviceMasterResponse, callback) => {
  const stringifyData = JSON.stringify(deviceMasterResponse);
  const parseData = JSON.parse(stringifyData);
  var dataLength = parseData.length;
  if (parseFloat(dataLength) === 0) {
    callback(1);
    return;
  }
  var singleItemData = parseData[index];
  var project_id = singleItemData.project_id;
  var device_id = singleItemData.id;
  Model.sequelize.query(`select device_id, isOnline, analogs from live_monitorings where project_id = '${project_id}' AND device_id = '${device_id}'`, {
    type: Model.sequelize.QueryTypes.SELECT,
  }).then((liveMonitoringsDataResponse) => {
    if (liveMonitoringsDataResponse.length > 0) {
      var analogData = liveMonitoringsDataResponse[0].analogs
      if (analogData != null) {
        for (let i = 0; i < analogData.length; i++) {
          var analogSingleData = analogData[i];
          if (analogSingleData.index == 1) {
            // status= 0 (ok), 1 (low), 2 (high) 
            var statusName = ""
            if (status == 0) {
              statusName = "ok"
            } else if (status == 1) {
              statusName = "Low Alert"
            } else {
              statusName = "High Alert"
            }
            if (analogSingleData.status == status) {
              singleItemData.status = statusName
              temp.push(singleItemData)
            }
          }
        }
      }
      //// increment  
      index = parseInt(index) + 1;
      if (parseFloat(index) < parseFloat(dataLength)) {
        exports.sensorDetailsByOmegaFunction(index, temp, status, deviceMasterResponse, callback);
      } else {
        callback(temp);
      }
    } else {
      //// increment  
      index = parseInt(index) + 1;
      if (parseFloat(index) < parseFloat(dataLength)) {
        exports.sensorDetailsByOmegaFunction(index, temp, status, deviceMasterResponse, callback);
      } else {
        callback(1);
      }
    }
  }).catch(err => {
    console.log(err)
  })
}

exports.getDigitInput = async (req, res) => {
  
  const project_id = req.params.project_id;
  var liveMonitoringsResponse = await Model.live_monitoring.findAll({ where: { project_id: project_id } });
  var index1 = {
    ok: 0,
    lowFlow: 0,
    highFlow: 0
  }
  var index2 = {
    ok: 0,
    lowFlow: 0,
    highFlow: 0
  }
  for (let i = 0; i < liveMonitoringsResponse.length; i++) {
    var watermeter = liveMonitoringsResponse[i].watermeter;
    if (watermeter != null) {
      for (let j = 0; j < watermeter.length; j++) {
        var singleItemData = watermeter[j];
        if (singleItemData.index == 1) {
          if (singleItemData.status == 0) {
            index1.ok = index1.ok + singleItemData.flow
          }
          if (singleItemData.status == 1) {
            index1.lowFlow = index1.lowFlow + singleItemData.flow
          }
          if (singleItemData.status == 2) {
            index1.highFlow = index1.highFlow + singleItemData.flow
          }
        }
        if (singleItemData.index == 2) {
          if (singleItemData.status == 0) {
            index2.ok = index2.ok + singleItemData.flow
          }
          if (singleItemData.status == 1) {
            index2.lowFlow = index2.lowFlow + singleItemData.flow
          }
          if (singleItemData.status == 2) {
            index2.highFlow = index2.highFlow + singleItemData.flow
          }
        }
      }
    }
  }

  var colorForIndex1 = [];
  var colorForIndex2 = [];
  var index1Reponse = [];
  if (index1.ok != 0) {
    colorForIndex1.push("#558bff"); // colorForIndex1 blue
    index1Reponse.push({ x: index1.ok, y: index1.ok, status: 0 });
  }
  if (index1.lowFlow != 0) {
    colorForIndex1.push("#8b8b8b"); // colorForIndex1 dark gray
    index1Reponse.push({ x: index1.lowFlow, y: index1.lowFlow, status: 1 });
  }
  if (index1.highFlow != 0) {
    colorForIndex1.push("#ff675a"); // colorForIndex1 red
    index1Reponse.push({
      x: index1.highFlow,
      y: index1.highFlow,
      status: 2
    });
  }
  var index2Reponse = [];
  if (index2.ok != 0) {
    colorForIndex2.push("#558bff"); // colorForIndex2 blue
    index2Reponse.push({ x: index2.ok, y: index2.ok, status: 0 });
  }
  if (index2.lowFlow != 0) {
    colorForIndex2.push("#8b8b8b"); // colorForIndex2 dark gray
    index2Reponse.push({ x: index2.lowFlow, y: index2.lowFlow, status: 1 });
  }
  if (index2.highFlow != 0) {
    colorForIndex2.push("#ff675a"); // colorForIndex2 red
    index2Reponse.push({
      x: index2.highFlow,
      y: index2.highFlow,
      status: 2
    });
  }
  var data = { index1Reponse, index2Reponse, colorForIndex1, colorForIndex2 };
  return response.success(res, "Digital Input Report", data);
}

exports.digitInputDetailsByOmega = (req, res) => {
  console.log("hello")
  if (!req.body.project_id) {
    return response.fail(res, "Project id is Required", "");
  }
  if (req.body.status == undefined) {
    return response.fail(res, "Status is Required", "");
  }
  const project_id = req.body.project_id;
  const status = req.body.status; // isOnline true or false
  Model.devices_master.findAll({
    where: { project_id: project_id, active: 1 },
    order: [["id", "DESC"]],
  }).then((deviceMasterResponse) => {
    if (deviceMasterResponse.length > 0) {
      var index = 0;
      var temp = []
      var temp1 = []
      exports.digitInputDetailsByOmegaFunction(index, temp, temp1, status, deviceMasterResponse, function (sensorDetailsByOmegaResponseData) {
        return response.success(res, "Device Details By Omega Id!", sensorDetailsByOmegaResponseData);
      });
    } else {
      return response.fail(res, "No Data Found!", "");
    }
  }).catch(err => {
    console.log(err);
  })
}
exports.digitInputDetailsByOmegaFunction = (index, temp, temp1, status, deviceMasterResponse, callback) => {
  const stringifyData = JSON.stringify(deviceMasterResponse);
  const parseData = JSON.parse(stringifyData);
  var dataLength = parseData.length;
  if (parseFloat(dataLength) === 0) {
    callback(1);
    return;
  }
  var singleItemData = parseData[index];
  var project_id = singleItemData.project_id;
  var device_id = singleItemData.id;
  Model.sequelize.query(`select device_id, isOnline, analogs, watermeter from live_monitorings where project_id = '${project_id}' AND device_id = '${device_id}'`, {
    type: Model.sequelize.QueryTypes.SELECT,
  }).then((liveMonitoringsDataResponse) => {
    if (liveMonitoringsDataResponse.length > 0) {
      var watermeter = liveMonitoringsDataResponse[0].watermeter
      if (watermeter != null) {
        for (let i = 0; i < watermeter.length; i++) {
          var watermeterSingleData = watermeter[i];
          if (watermeterSingleData.index == 1) {
            // status= 0 (ok), 1 (low), 2 (high) 
            var statusName = ""
            if (status == 0) {
              statusName = "ok"
            } else if (status == 1) {
              statusName = "Low Flow"
            } else {
              statusName = "High Flow"
            }
            if (watermeterSingleData.status == status) {
              singleItemData.status = statusName
              temp.push(singleItemData)
            }
          }
          if (watermeterSingleData.index == 2) {
            // status= 0 (ok), 1 (low), 2 (high) 
            var statusName = ""
            if (status == 0) {
              statusName = "ok"
            } else if (status == 1) {
              statusName = "Low Flow"
            } else {
              statusName = "High Flow"
            }
            if (watermeterSingleData.status == status) {
              singleItemData.status = statusName
              temp1.push(singleItemData)
            }
          }
        }
      }
      var tempData = {
        index1: temp,
        index2: temp1,
      }
      //// increment  
      index = parseInt(index) + 1;
      if (parseFloat(index) < parseFloat(dataLength)) {
        exports.digitInputDetailsByOmegaFunction(index, temp, temp1, status, deviceMasterResponse, callback);
      } else {
        callback(tempData);
      }
    } else {
      //// increment  
      index = parseInt(index) + 1;
      if (parseFloat(index) < parseFloat(dataLength)) {
        exports.digitInputDetailsByOmegaFunction(index, temp, temp1, status, deviceMasterResponse, callback);
      } else {
        callback(1);
      }
    }
  }).catch(err => {
    console.log(err)
  })
}