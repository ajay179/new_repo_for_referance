const Model = require("../../models");
const Validator = require("fastest-validator");
var commonfunction = require("../commanFunctions/commanFunctions.controller");
var response = require("../../middleware/response.middleware");
var fs = require("fs");
var path = require("path");
var bcrypt = require("bcryptjs");
const config = require("../../config/jwt.secret");
const fetch = require("node-fetch");
const moment = require("moment");
const { Integer } = require("read-excel-file");
const excelController = require("../../middleware/excel.middleware");
var CryptoJS = require("crypto-js");
const { sendMessage, getTextMessageInput } = require("../../middleware/messageHelper.middleware");

exports.masterCreateUpdate = async (req, res) => {
  if (!req.body.module) {
    return response.fail(res, "Module Name is Required", "");
  }
  if (!req.body.data) {
    return response.fail(res, "Data is Required", "");
  }

  var id = req.body.id;
  var module = req.body.module;
  var data = req.body.data;
  var uniqueNo = req.body.uniqueNo;
  var transactionId = 1;
  var field_name = "";
  if (uniqueNo != undefined) {
    transactionId = uniqueNo.transactionId;
    field_name = uniqueNo.field_name;
  }
  if (module === "user_master" || module === "project") {
    if (id) {
      bcrypt.genSalt(10, function (err, salt) {
        var profile_pic = req.body.data.profile_pic;
        bcrypt.hash(req.body.data.password, salt, function (err, hash) {
          // image upload code
          var decodeData = "";
          console.log("profile pic", profile_pic, data);
          if (profile_pic != undefined) {
            let profileSliceData = profile_pic.slice(0, 16);
            if (profileSliceData == "data:application") {
              decodeData = profile_pic.replace(
                /^data:application\/\w+;base64,/,
                ""
              );
            } else {
              decodeData = profile_pic.replace(/^data:image\/\w+;base64,/, "");
            }
            var extension = profile_pic.split(";")[0].split("/")[1];
            if (module === "user_master") {
              var filePath = "./uploads/profile_picture/";
            } else {
              var filePath = "./uploads/project_profile/";
            }

            if (!fs.existsSync(filePath)) {
              fs.mkdirSync(filePath, { recursive: true });
            }

            fs.exists(filePath, function (exists) {
              let fileName =
                "ProfilePic_" +
                new Date().getTime() +
                Math.floor(Math.random() * 10) +
                "." +
                extension;
              let finalpath = filePath + fileName;
              try {
                fs.writeFileSync(
                  finalpath,
                  decodeData,
                  "base64",
                  function (err) { }
                );

                const userData = {
                  employee_code: req.body.data.employee_code,
                  user_type: req.body.data.user_type,
                  gender_id: req.body.data.gender_id,
                  first_name: req.body.data.first_name,
                  last_name: req.body.data.last_name,
                  email_id: req.body.data.email_id,
                  mobile_number: req.body.data.mobile_number,
                  country_id: req.body.data.country_id,
                  state_id: req.body.data.state_id,
                  city_id: req.body.data.city_id,
                  tahasil_id: req.body.data.tahasil_id,
                  village_id: req.body.data.village_id,
                  marital_status: req.body.data.marital_status,
                  address: req.body.data.address,
                  pin: req.body.data.pin,
                  qualification: req.body.data.qualification,
                  dob: req.body.data.dob,
                  joining_date: req.body.data.joining_date,
                  profile_pic: fileName,
                  username: req.body.data.username,
                  password: hash,
                  project_selected: req.body.data.project_selected,
                  active: req.body.data.active,
                  created_by: req.body.data.created_by,
                  updated_by: req.body.data.updated_by,
                };
                // console.log(userData);
                // return false;
                Model[module]
                  .update(userData, {
                    where: {
                      id: id,
                    },
                  })
                  .then((MasterUpdateDataResponse) => {
                    return response.success(
                      res,
                      "Record Updated",
                      MasterUpdateDataResponse
                    );
                  })
                  .catch((err) => {
                    var errorMessage = "";
                    if (err.message == "Validation error") {
                      errorMessage = "Duplicate Record";
                    } else {
                      errorMessage = err.message;
                    }
                    return response.catchError(res, errorMessage, data, module);
                  });
              } catch (err) {
                console.log(err);
              }
            });
          } else {
            // const userData = {
            //   project_selected: req.body.data.project_selected,
            // };
            Model[module]
              .update(data, {
                where: {
                  id: id,
                },
              })
              .then((MasterUpdateDataResponse) => {
                return response.success(
                  res,
                  "Record Updated",
                  MasterUpdateDataResponse
                );
              })
              .catch((err) => {
                var errorMessage = "";
                if (err.message == "Validation error") {
                  errorMessage = "Duplicate Record";
                } else {
                  errorMessage = err.message;
                }
                return response.catchError(res, errorMessage, data, module);
              });
          }
        });
      });
    } else {
      Model.user_master
        .findOne({ where: { email_id: req.body.data.email_id } })
        .then((result) => {
          if (result) {
            res.json({
              status: 400,
              code: 0,
              message: "Email Id Already Exists ",
              data: "",
            });
          } else {
            bcrypt.genSalt(10, function (err, salt) {
              bcrypt.hash(req.body.data.password, salt, function (err, hash) {
                var decodeData = "";
                var profile_pic = req.body.data.profile_pic;
                commonfunction.uniqueNumberFunction(
                  transactionId,
                  function (uniqueNumberResponse) {
                    if (uniqueNumberResponse.code === 1) {
                      if (profile_pic === null) {
                        var fileName = "ProfilePic_16672967979003.png";
                        const userData = {
                          employee_code: uniqueNumberResponse.data,
                          user_type: req.body.data.user_type,
                          gender_id: req.body.data.gender_id,
                          first_name: req.body.data.first_name,
                          last_name: req.body.data.last_name,
                          email_id: req.body.data.email_id,
                          mobile_number: req.body.data.mobile_number,
                          country_id: req.body.data.country_id,
                          state_id: req.body.data.state_id,
                          city_id: req.body.data.city_id,
                          tahasil_id: req.body.data.tahasil_id,
                          village_id: req.body.data.village_id,
                          marital_status: req.body.data.marital_status,
                          address: req.body.data.address,
                          pin: req.body.data.pin,
                          qualification: req.body.data.qualification,
                          dob: req.body.data.dob,
                          joining_date: req.body.data.joining_date,
                          profile_pic: fileName,
                          username: req.body.data.username,
                          password: hash,
                          project_selected: req.body.data.project_selected,
                          active: req.body.data.active,
                          created_by: req.body.data.created_by,
                          updated_by: req.body.data.updated_by,
                        };

                        const schema = {
                          first_name: {
                            type: "string",
                            optional: false,
                            max: "100",
                          },
                          last_name: {
                            type: "string",
                            optional: false,
                            max: "100",
                          },
                          email_id: {
                            type: "string",
                            optional: false,
                            max: "100",
                          },
                          password: {
                            type: "string",
                            optional: false,
                            max: "100",
                          },
                        };

                        const v = new Validator();
                        const validatorResponse = v.validate(userData, schema);
                        if (validatorResponse !== true) {
                          res.json({
                            status: 400,
                            code: 0,
                            message: "Validation Failed",
                            data: validatorResponse,
                          });
                          return;
                        }

                        Model.user_master.create(userData).then((result) => {
                          res.json({
                            status: 200,
                            code: 1,
                            message: "User Created",
                            data: result,
                            // accesstoken: token,
                          });
                        });
                      } else {
                        var profileSliceData = profile_pic.slice(0, 16);

                        if (profileSliceData === "data:application") {
                          decodeData = profile_pic.replace(
                            /^data:application\/\w+;base64,/,
                            ""
                          );
                          var extension = profile_pic
                            .split(";")[0]
                            .split("/")[1];
                        } else {
                          decodeData = profile_pic.replace(
                            /^data:image\/\w+;base64,/,
                            ""
                          );
                          var extension = profile_pic
                            .split(";")[0]
                            .split("/")[1];
                        }
                        var filePath = "./uploads/profile_picture/";
                        if (!fs.existsSync(filePath)) {
                          fs.mkdirSync(filePath, { recursive: true });
                        }

                        fs.exists(filePath, function (exists) {
                          var fileName =
                            "ProfilePic_" +
                            new Date().getTime() +
                            Math.floor(Math.random() * 10) +
                            "." +
                            extension;

                          let finalpath = filePath + fileName;
                          try {
                            fs.writeFileSync(
                              finalpath,
                              decodeData,
                              "base64",
                              function (err) { }
                            );

                            const userData = {
                              employee_code: uniqueNumberResponse.data,
                              user_type: req.body.data.user_type,
                              gender_id: req.body.data.gender_id,
                              first_name: req.body.data.first_name,
                              last_name: req.body.data.last_name,
                              email_id: req.body.data.email_id,
                              mobile_number: req.body.data.mobile_number,
                              country_id: req.body.data.country_id,
                              state_id: req.body.data.state_id,
                              city_id: req.body.data.city_id,
                              tahasil_id: req.body.data.tahasil_id,
                              village_id: req.body.data.village_id,
                              address: req.body.data.address,
                              pin: req.body.data.pin,
                              qualification: req.body.data.qualification,
                              dob: req.body.data.dob,
                              joining_date: req.body.data.joining_date,
                              profile_pic: fileName,
                              username: req.body.data.username,
                              password: hash,
                              project_selected: req.body.data.project_selected,
                              active: req.body.data.active,
                              created_by: req.body.data.created_by,
                              updated_by: req.body.data.updated_by,
                            };

                            const schema = {
                              first_name: {
                                type: "string",
                                optional: false,
                                max: "100",
                              },
                              last_name: {
                                type: "string",
                                optional: false,
                                max: "100",
                              },
                              email_id: {
                                type: "string",
                                optional: false,
                                max: "100",
                              },
                              password: {
                                type: "string",
                                optional: false,
                                max: "100",
                              },
                            };

                            const v = new Validator();
                            const validatorResponse = v.validate(
                              userData,
                              schema
                            );
                            if (validatorResponse !== true) {
                              res.json({
                                status: 400,
                                code: 0,
                                message: "Validation Failed",
                                data: validatorResponse,
                              });
                              return;
                            }

                            Model.user_master
                              .create(userData)
                              .then((result) => {
                                res.json({
                                  status: 200,
                                  code: 1,
                                  message: "User Created",
                                  data: result,
                                  // accesstoken: token,
                                });
                              });
                          } catch (err) {
                            console.log(err);
                          }
                        });
                      }
                    } else {
                      return response.fail(
                        res,
                        uniqueNumberResponse.status,
                        ""
                      );
                    }
                  }
                );
              });
            });
          }
        })
        .catch((err) => {
          res.json({
            status: 500,
            code: 0,
            message: err,
            data: "",
          });
        });
    }
  } else {
    ///////////
    commonfunction.uniqueNumberFunction(
      transactionId,
      function (uniqueNumberResponse) {
        var inputData = data;
        if (uniqueNumberResponse.code === 1) {
          if (uniqueNo != undefined) {
            const data12 = JSON.stringify(data);
            var inputData = JSON.parse(data12);
            inputData[field_name] = uniqueNumberResponse.data;
          }
          if (Model[module]) {
            if (id) {
              Model[module]
                .update(data, {
                  where: {
                    id: id,
                  },
                })
                .then((MasterUpdateDataResponse) => {
                  return response.success(
                    res,
                    "Record Updated",
                    MasterUpdateDataResponse
                  );
                })
                .catch((err) => {
                  var errorMessage = "";
                  if (err.message == "Validation error") {
                    errorMessage = "Duplicate Record";
                  } else {
                    errorMessage = err.message;
                  }
                  return response.catchError(res, errorMessage, data, module);
                });
            } else {
              //console.log(inputData);
              //  return false;
              Model[module]
                .create(inputData)
                .then((MasterCreateDataResponse) => {
                  console.log(MasterCreateDataResponse);
                  return response.success(
                    res,
                    "Record Created",
                    MasterCreateDataResponse
                  );
                })
                .catch((err) => {
                  console.log(err);
                  var errorMessage = "";
                  if (err.message == "Validation error") {
                    errorMessage = "Duplicate Record";
                  } else {
                    errorMessage = err.message;
                  }
                  return response.catchError(res, errorMessage, "", module);
                });
            }
          } else {
            return response.fail(res, "Invalid Model Name", "");
          }
        } else {
          return response.fail(res, uniqueNumberResponse.status, "");
        }
      }
    );
  }
};

exports.graphqlMasterCreateUpdate = async (
  req,
  res,
  table,
  bermad_program_id,
  program_index
) => {
  // return false
  if (!req.body.module) {
    return response.fail(res, "Module Name is Required", "");
  }
  if (!req.body.data) {
    return response.fail(res, "Data is Required", "");
  }

  if (table) {
    var id = req.body.id;
    var module = table;
    var data = req.body.data;
    var programsAmountdata = req.body.data.programAmount;
    var changedStatus = 0;
    var changedType = 0;
    var changedMeasurementType = 0;

    //status
    if (req.body.data.status) {
      if (req.body.data.status == "ACTIVE") {
        changedStatus = 1;
      } else if (req.body.data.status == "DELETED") {
        changedStatus = 2;
      } else {
        changedStatus = 0;
      }
    }

    //type
    if (req.body.data.type) {
      if (req.body.data.type == "CYCLIC") {
        changedType = 2;
      } else {
        changedType = 1;
      }
    }

    //measurementType
    if (req.body.data.measurementType) {
      if (req.body.data.measurementType == "Duration") {
        changedMeasurementType = 2;
      } else {
        changedMeasurementType = 1;
      }
    }

    var data = req.body.data;
    var inputData = data;
    const data12 = JSON.stringify(data);
    var inputData = JSON.parse(data12);

    if (bermad_program_id) {
      //console.log("bermad_program_id", bermad_program_id);
      inputData["bermad_program_id"] = bermad_program_id;
    }
    if (program_index) {
      inputData["program_index"] = program_index;
    }

    if (req.body.data.status) {
      inputData["status"] = changedStatus;
    }
    if (req.body.data.type) {
      inputData["type"] = changedType;
    }
    if (req.body.data.measurementType) {
      inputData["measurementType"] = changedMeasurementType;
    }
  } else {
    var module = req.body.module;
    var data = req.body.data;
  }

  var id = req.body.id;

  if (Model[module]) {
    if (id) {
      Model[module]
        .update(inputData, {
          where: {
            id: id,
          },
        })
        .then((MasterUpdateDataResponse) => {
          //Delete program ampunt data
          Model.programs_amount.destroy({
            where: { program_id: id },
          });

          if (programsAmountdata) {
            programsAmountdata.forEach((element) => {
              Model.devices_details
                .findOne({
                  attributes: ["id"],
                  where: { input_id: element.valve.connect.id, type: 1 },
                })
                .then((device_details) => {
                  var valveid = device_details.id;
                  var amountData = {
                    program_id: id,
                    bermad_valve_id: element.valve.connect.id,
                    valve_id: valveid,
                    amount: element.amount,
                    order: element.order,
                  };
                  Model.programs_amount.create(amountData).then((result) => {
                    //// increment
                  });
                })
                .catch((err) => { });
            });
          }
          return response.success(
            res,
            "Record Updated"
            //MasterUpdateDataResponse
          );
        })
        .catch((err) => {
          var errorMessage = "";
          if (err.message == "Validation error") {
            errorMessage = "Duplicate Record";
          } else {
            errorMessage = err.message;
          }
          return response.catchError(res, errorMessage, data, module);
        });
    } else {
      Model[module]
        .create(inputData)
        .then((MasterCreateDataResponse) => {
          var programAmountPayload = {
            program_id: MasterCreateDataResponse.id,
            omega_id: req.body.data.omega_id,
            valve_id: req.body.data.valve_id,
            bermad_valve_id: req.body.data.bermad_valve_id,
            amount: req.body.data.amount,
            order: req.body.data.order,
          };
          Model.programs_amount
            .create(programAmountPayload)
            .then((MasterCreateDataResponse) => {
              return response.success(
                res,
                "Record Created",
                MasterCreateDataResponse
              );
            });
        })
        .catch((err) => {
          console.log(err);
          var errorMessage = "";
          if (err.message == "Validation error") {
            errorMessage = "Duplicate Record";
          } else {
            errorMessage = err.message;
          }
          return response.catchError(res, errorMessage, "", module);
        });
    }
  } else {
    return response.fail(res, "Invalid Model Name", "");
  }
};

// exports.updateUserMaster = async (req, res) => {
//   if (!req.body.module) {
//     return response.fail(res, "Model Name is Required", "");
//   }
//   if (!req.body.data) {
//     return response.fail(res, "Data Name is Required", "");
//   }
//   var id = req.body.id;
//   var module = req.body.module;
//   // var data = req.body.data;

// };

exports.profileCreateUpdate = async (req, res) => {
  /* if (!req.body.id) {
    return response.fail(res, "Id is Required", "");
  }*/
  var id = req.body.id;
  var module = req.body.module;
  var data = req.body.data;
  var submodule_id = req.body.submodule_id;
  var submodule = req.body.submodule;
  var submoduledata = req.body.submoduledata;
  var submodule_field_name = req.body.submodule_field_name;
  var uniqueNo = req.body.uniqueNo;
  var transactionId = 1;
  var field_name = "";
  if (uniqueNo != undefined) {
    transactionId = uniqueNo.transactionId;
    field_name = uniqueNo.field_name;
  }
  var profile_pic = req.body.data.profile_pic;
  if (Model[module]) {
    if (id) {
      // update
      if (module === "project" && profile_pic != undefined) {
        console.log("iffffffffffffffffffff");
        // console.log("profile_pic", profile_pic);
        // return false;
        var decodeData = "";
        let profileSliceData = profile_pic.slice(0, 16);
        if (profileSliceData == "data:application") {
          decodeData = profile_pic.replace(
            /^data:application\/\w+;base64,/,
            ""
          );
        } else {
          decodeData = profile_pic.replace(/^data:image\/\w+;base64,/, "");
        }
        var extension = profile_pic.split(";")[0].split("/")[1];
        var filePath = "./uploads/project_profile/";
        if (!fs.existsSync(filePath)) {
          fs.mkdirSync(filePath, { recursive: true });
        }
        var fileName = "";
        fs.exists(filePath, function (exists) {
          fileName =
            "ProfilePic_" +
            new Date().getTime() +
            Math.floor(Math.random() * 10) +
            "." +
            extension;

          let finalpath = filePath + fileName;
          fs.writeFileSync(finalpath, decodeData, "base64", function (err) { });
          delete data.profile_pic;
          const stringifyData = JSON.stringify(data);
          const parseData = JSON.parse(stringifyData);
          parseData["profile_pic"] = fileName;
          var singleItemData = parseData;
          Model[module]
            .update(singleItemData, {
              where: {
                id: id,
              },
            })
            .then((MasterUpdateDataResponse) => {
              var index = 0;
              var foriegn_key = id;
              const submoduledata_string = JSON.stringify(submoduledata);
              var subinputData = JSON.parse(submoduledata_string);
              exports.createSubModuleFunction(
                index,
                foriegn_key,
                submodule_field_name,
                Model[submodule],
                subinputData,
                function (AccessResponse) {
                  if (AccessResponse.status == 1) {
                    res.json({
                      status: 200,
                      code: 1,
                      message: AccessResponse.message,
                    });
                  } else {
                    res.json({
                      status: 200,
                      code: 0,
                      message: AccessResponse.message,
                    });
                  }
                }
              );
            })
            .catch((err) => {
              console.log(err)
            });
        });
      } else {
        console.log("elseeeeeeee", module);
        const stringifyData = JSON.stringify(data);
        var parseData = JSON.parse(stringifyData);
        if (module === "project") {
          parseData["profile_pic"] = "default.png";
        }
        Model[module]
          .update(parseData, {
            where: {
              id: id,
            },
          })
          .then((MasterUpdateDataResponse) => {
            var index = 0;
            var foriegn_key = id;
            const submoduledata_string = JSON.stringify(submoduledata);
            var subinputData = JSON.parse(submoduledata_string);
            console.log("subinputData---------", subinputData);
            exports.createSubModuleFunction(
              index,
              foriegn_key,
              submodule_field_name,
              Model[submodule],
              subinputData,
              function (AccessResponse) {
                if (AccessResponse.status == 1) {
                  res.json({
                    status: 200,
                    code: 1,
                    message: AccessResponse.message,
                  });
                } else {
                  res.json({
                    status: 200,
                    code: 0,
                    message: AccessResponse.message,
                  });
                }
              }
            );
          })
          .catch((err) => {
            console.log(err)
          });
      }
    } else {
      // create
      commonfunction.uniqueNumberFunction(
        transactionId,
        async function (uniqueNumberResponse) {
          if (uniqueNumberResponse.code === 1) {
            console.log("else");
            var inputData = data
            if (uniqueNo != undefined) {
              inputData[field_name] = uniqueNumberResponse.data;
            }
            if (submodule_field_name != undefined) {
              const submoduledata_string = JSON.stringify(submoduledata);
              var subinputData = JSON.parse(submoduledata_string);
            }
            console.log("inputData-------", inputData.password)
            // inputData.password = hash
            if (inputData.password != undefined) {
              var salt = await bcrypt.genSalt(10)
              var hash = await bcrypt.hash(inputData.password, salt)
              inputData.password = hash
            }
            console.log("inputData--", inputData);

            Model[module]
              .create(inputData)
              .then((CreateDataResponse) => {
                if (submodule_field_name != undefined) {
                  var foriegn_key = CreateDataResponse.id;
                  var index = 0;
                  exports.createSubModuleFunction(
                    index,
                    foriegn_key,
                    submodule_field_name,
                    Model[submodule],
                    subinputData,
                    function (AccessResponse) {
                      if (AccessResponse.status == 1) {
                        res.json({
                          status: 200,
                          code: 1,
                          message: AccessResponse.message,
                        });
                      } else {
                        res.json({
                          status: 200,
                          code: 0,
                          message: AccessResponse.message,
                        });
                      }
                    }
                  );
                } else {
                  return response.success(res, "Record Created");
                }

                //return response.success(res, "Record Created");
              })
              .catch((err) => {
                res.json({
                  status: 200,
                  code: 0,
                  message: err.message,
                });
                //  console.log("err", err.message);
                // return false;
                // return response.catchError(res, err.message, "", module);
              });
          }
        }
      );
    } //else close for create module
  } else {
    return response.fail(res, "Invalid Model Name", "");
  }
};

exports.createSubModuleFunction = (
  index,
  foriegn_key,
  submodule_field_name,
  submodule,
  submoduleDetails,
  callback
) => {
  const stringifyData = JSON.stringify(submoduleDetails);
  const parseData = JSON.parse(stringifyData);
  var dataLength = parseData.length; //2
  parseData[index].data[submodule_field_name] = foriegn_key;
  var singleItemData = parseData[index].data; //single item
  var submodule_id = parseData[index].id;
  console.log("singleItemData", singleItemData);
  //return false;
  if (submodule) {
    if (submodule_id > 0) {
      submodule
        .update(singleItemData, {
          where: {
            id: submodule_id,
          },
        })
        .then((detailUpdateDataResponse) => {
          index = parseInt(index) + 1;
          if (parseFloat(index) < parseFloat(dataLength)) {
            exports.createSubModuleFunction(
              index,
              foriegn_key,
              submodule_field_name,
              submodule,
              submoduleDetails,
              callback
            );
          } else {
            callback({ status: 1, message: "Record Updated" });
          }
        })
        .catch((err) => {
          console.log(err.message);
          return false;
          // return response.catchError({ status: 1, message: err.message });
        });
    } else {
      submodule
        .create(singleItemData)
        .then((detailCreateDataResponse) => {
          index = parseInt(index) + 1;
          if (parseFloat(index) < parseFloat(dataLength)) {
            exports.createSubModuleFunction(
              index,
              foriegn_key,
              submodule_field_name,
              submodule,
              submoduleDetails,
              callback
            );
          } else {
            callback({ status: 1, message: "Record Created" });
          }
          //return response.success(res, "Record Created");
        })
        .catch((err) => {
          console.log(err.message);
          return false;
          //   return response.catchError({ status: 1, message: err.message });
        });
    }
  } else {
    console.log(err.message);
    return false;
    //callback({ status: 0, message: "Invalid Sub Model Name" });
  }
};

exports.getMasterData = async (req, res) => {
  /* if (!req.body.id) {
    return response.fail(res, "Id is Required", "");
  }*/
  if (!req.body.module) {
    return response.fail(res, "Model Name is Required", "");
  }

  var module = req.body.module;
  var whereCondition = req.body.whereCondition;

  if (!whereCondition) {
    var whereCondition = [];
  }
  const id = req.body.id;
  if (id != undefined && id != null && id != "") {
    whereCondition.push({ id: id });
  }

  if (Model[module]) {
    Model[module]
      //.findByPk(id)
      .findOne({ where: whereCondition })
      .then((masterDataById) => {
        return response.success(res, "Master Data By Id", masterDataById);
      })
      .catch((err) => {
        console.log(err);
        return response.catchError(res, err.message, "", module, module);
      });
  } else {
    return response.fail(res, "Invalide Model Name", "");
  }
};

exports.getMasterList = (req, res) => {
  if (!req.body.module) {
    return response.fail(res, "Model Name is Required", "");
  }
  var modelName = req.body.module;
  var relations = req.body.relation;
  var active = req.body.active;
  var condition = req.body.condition;
  var id = req.body.id;
  var whereCondition = [];
  if (active == 1) {
    whereCondition.push({ active: 1 });
  }
  if (id != undefined && id != null && id != "") {
    whereCondition.push({ id: id });
  }
  if (condition) {
    whereCondition.push(condition);
  }
  if (Model[modelName]) {
    if (relations != undefined) {
      var includeVar = [];
      for (i = 0; i < relations.length; i++) {
        var subIncludeVar = [];
        var subSubIncludeVar = [];
        if (
          relations[i].subSubModule != undefined &&
          relations[i].subSubModule != ""
        ) {
          subSubIncludeVar.push({
            model: Model[relations[i].subSubModule],
            as: relations[i].subSubModule,
            required: false,
          });
        }
        console.log("submodule", relations[i].subModule);
        if (
          relations[i].subModule != undefined &&
          relations[i].subModule != ""
        ) {
          subIncludeVar.push({
            model: Model[relations[i].subModule],
            as: relations[i].subModule,
            required: false,
            include: subSubIncludeVar,
          });
        }
        includeVar.push({
          model: Model[relations[i].module],
          as: relations[i].module,
          required: false,
          include: subIncludeVar,
        });
      }
    }

    var index = 0;
    Model[modelName]
      .findAll({
        where: whereCondition,
        order: [
          ["active", "DESC"],
          ["id", "DESC"],
        ],
        include: includeVar,
      })
      .then((MasterAllDataResponse) => {
        var listArray = [];
        for (let i = 0; i < MasterAllDataResponse.length; i++) {
          MasterAllDataResponse[i].dataValues.index = i + 1;
          listArray.push(MasterAllDataResponse[i]);
        }
        return response.success(res, "Master Data1", listArray);
      })
      .catch((err) => {
        return response.catchError(res, err.message, "", module);
      });
  } else {
    return response.fail(res, "Invalide Model Name", "");
  }
};

// exports.isActive = async (req, res) => {
//   let id = req.body.id;
//   let module = req.body.module;
//   let active = req.body.active;
//   if (Model[module]) {
//     Model[module]
//       .update(
//         {
//           active: active,
//         },
//         {
//           where: {
//             id: id,
//           },
//         }
//       )
//       .then((MasterUpdateIsActiveDataResponse) => {
//         return response.success(
//           res,
//           "Status Changed",
//           MasterUpdateIsActiveDataResponse
//         );
//       })
//       .catch((err) => {
//         var errorMessage = "";
//         if (err.message == "Validation error") {
//           errorMessage = "Duplicate Record";
//         } else {
//           errorMessage = err.message;
//         }
//         return response.catchError(res, errorMessage, data, module);
//       });
//   } else {
//     return response.fail(res, "Invalide Model Name", "");
//   }
// };

exports.getMasterActiveAllData = async (req, res) => {
  if (!req.body.module) {
    return response.fail(res, "Model Name is Required", "");
  }
  var module = req.body.module;
  if (Model[module]) {
    Model[module]
      .findAll({
        where: {
          isActive: 1,
        },
      })
      .then((allMasterActiveData) => {
        return response.success(res, "All Active Data", allMasterActiveData);
      })
      .catch((err) => {
        return response.catchError(res, err.message, "", module);
      });
  } else {
    return response.fail(res, "Invalide Model Name", "");
  }
};

exports.uploadImage = async (req, res) => {
  var id = req.body.id;
  var file = req.body.file;
  var folderName = "no";
  commonfunction.uploadImageFunction(
    id,
    file,
    folderName,
    function (uploadImageResponse) {
      if (uploadImageResponse.code == 1) {
        return response.success(
          res,
          uploadImageResponse.status,
          uploadImageResponse.data
        );
      } else {
        return response.fail(res, uploadImageResponse.status, "");
      }
    }
  );
};

exports.mailSend = async (req, res) => {
  var emailTo = req.body.emailTo;
  var subject = req.body.subject;
  var body = req.body.body;
  commonfunction.sendMailFunction(
    emailTo,
    subject,
    body,
    function (sendMailResponse) {
      if (sendMailResponse.code == 1) {
        return response.success(res, sendMailResponse.status, "");
      } else {
        return response.fail(res, sendMailResponse.status, "");
      }
    }
  );
};

exports.smsGateWay = async (req, res) => {
  var mobile = req.body.mobile;
  commonfunction.smsGateWayFunction(mobile, function (smsGatewayResponse) {
    if (smsGatewayResponse.code == 1) {
      return response.success(res, smsGatewayResponse.status, "");
    } else {
      return response.fail(res, smsGatewayResponse.status, "");
    }
  });
};

exports.validator = async (req, res) => {
  const post = {
    title: req.body.title,
    content: req.body.content,
    imgUrl: req.body.imgUrl,
    categoryId: req.body.categoryId,
    isActive: req.body.isActive,
  };

  const schema = {
    title: { type: "string", optional: false, max: "100" },
    content: { type: "string", optional: false, max: "100" },
    categoryId: { type: "number", optional: false, max: "100" },
  };
  const v = new Validator();
  const validatorResponse = v.validate(post, schema);
  if (validatorResponse !== true) {
    return response.vaildationError(
      res,
      "Validation Failed",
      validatorResponse
    );
  }
};

exports.importFile = async (req, res) => {
  //var project_id=
  var filePath = "./uploads/importFile/"; //  req.file.filename =
  var fileName = req.file.filename; //"1111111.xlsx";

  commonfunction.importFileFunction(
    filePath,
    fileName,
    function (importFileResponse) {
      if (importFileResponse.code == 1) {
        return response.success(res, importFileResponse.status, "");
      } else {
        return response.fail(res, importFileResponse.status, "");
      }
    }
  );
};

exports.exportFile = async (req, res) => {
  if (!req.body.module) {
    return response.fail(res, "Model Name Is Required", "");
  }
  var module = req.body.module;
  commonfunction.exportFileFunction(module, function (exportFileResponse) {
    if (exportFileResponse.code == 1) {
      return response.success(res, exportFileResponse.status, "");
    } else {
      return response.fail(res, exportFileResponse.status, "");
    }
  });
};

// exports.getStateDataByCountryId = async (req, res) => {
//   if (!req.body.module) {
//     return response.fail(res, "Model Name is Required", "");
//   }
//   const id = req.body.id;
//   var moduleName = req.body.module;
//   var leftJoinmodule = req.body.leftJoinmodule;
//   console.log(leftJoinmodule)
//   joinModelName = Model[leftJoinmodule];
//   if (Model[moduleName]) {
//     Model[moduleName]
//       .findAll({
//         raw: true,

//         include: [{
//           model: joinModelName,
//           as: 'country',
//           where: {
//             country_id: id,
//             active: 1,
//           }
//         },]

//         // include: [{
//         //   model: Model.leftJoinmodule,
//         //   as: 'country',
//         //   where: {
//         //     id: id
//         //   }
//         // }]
//       })
//       .then((allStateMasterData) => {
//         return response.success(res, "All State Data", allStateMasterData);
//       })
//       .catch((err) => {
//         return response.catchError(res, err.message, "", module);
//       });
//   } else {
//     return response.fail(res, "Invalide Model Name", "");
//   }
// };

exports.getDependentMasterList = async (req, res) => {
  if (!req.body.module) {
    return response.fail(res, "Model Name is Required", "");
  }
  var column = req.body.column;
  const value = req.body.value;
  var module = req.body.module;
  console.log("module", module);
  moduleName = module.replace(/_/g, " ");
  // moduleName = moduleName.capitalize()
  // const active = 'active';
  // let filters = {};
  // filters[column] = value;
  // filters[active] = 1;
  if (Model[module]) {
    Model[module]
      .findAll({
        raw: true,
        where: {
          [column]: value,
          active: 1,
        },
        order: [["id", "DESC"]],
        // where: filters
      })
      .then((allDependentMasterData) => {
        return response.success(
          res,
          "All " + moduleName + " Data",
          allDependentMasterData
        );
      })
      .catch((err) => {
        return response.catchError(res, err.message, "", module);
      });
  } else {
    return response.fail(res, "Invalid Model Name", "");
  }
};

exports.getCityDataByStateId = async (req, res) => {
  // console.log('get city'); return false;
  if (!req.body.id) {
    return response.fail(res, "Id Is Required", "");
  }
  if (!req.body.module) {
    return response.fail(res, "Model Name Is Required", "");
  }

  const id = req.body.id;
  var module = req.body.module;
  var leftJoinmodule = req.body.leftJoinmodule;
  // var str = 0;
  // var index = 0;
  // exports.LeftJoinAllMasterInnerFunction(
  //   index,
  //   leftJoinmodule,
  //   str,
  //   function (response) {
  //     str = response.data;
  //   }
  // );
  if (Model[module]) {
    let leftJoinModuleName = leftJoinmodule;
    console.log("leftJoinModuleName-->", leftJoinModuleName);
    Model[module]
      .findAll({
        // include: [{ model: Model.leftJoinModule, where: { id: id }, required: false }],
        include: [
          { model: Model.state_master, where: { id: id }, required: false },
        ],
      })
      .then((joinData) => {
        return response.success(res, "Data By Id", joinData);
      })
      .catch((err) => {
        console.log(err);
        return response.fail(res, err.message, "");
      });

    return false;
    // exports.LeftJoinModelFunction(id, module, str, modelData, function (LeftJoinResponse) {
    //   if(LeftJoinResponse.code == 1){
    //     console.log("success")
    //     return response.success(res, LeftJoinResponse.message, LeftJoinResponse.data);
    //   } else {
    //     console.log("fail")
    //     return response.fail(res, LeftJoinResponse.message , "");
    //   }
    // });
  } else {
    return response.fail(res, "Invalide Model Name", "");
  }
  // Shop.findAll({
  //   where:{id:shopId},
  //   include:[
  //       { model:ShopAd, as:'ads',
  //         where:{
  //               is_valid:1,
  //               is_vertify:1},
  //         required:false
  //         }
  //       ]
  //    })
  //    .success(function(result) {
  //      callback(result);
  //  });
};

exports.LeftJoinAllMasterInnerFunction = function (
  index,
  leftJoinmodule,
  str,
  callback
) {
  const leftJoinmoduleStringfyData = JSON.stringify(leftJoinmodule);
  let leftJoinmoduleParseData = JSON.parse(leftJoinmoduleStringfyData);
  var dataLength = leftJoinmoduleParseData.length;
  var SingleData = leftJoinmoduleParseData[index];
  index = parseInt(index) + 1;
  if (parseInt(index) < parseInt(dataLength)) {
    str = "{model:Model. " + SingleData + " ,where:{ id: id },required:false,}";
    exports.LeftJoinAllMasterInnerFunction(
      index,
      leftJoinmodule,
      str,
      callback
    );
  } else {
    str +=
      "," + "{model:Model. " + SingleData + ",where:{id:id},required:false,}";
    callback({ code: 1, data: str, message: "success" });
  }
};

exports.LeftJoinModelFunction = function (
  id,
  module,
  str,
  modelData,
  callback
) {
  modelData
    .then((data) => {
      callback({ code: 1, message: "Data By Id", data: data });
    })
    .catch((err) => {
      callback({ code: 0, message: err.message, data: "" });
    });
};

exports.uniqueNumber = async (req, res) => {
  commonfunction.uniqueNumberFunction(1, function (uniqueNumberResponse) {
    if (uniqueNumberResponse.code === 1) {
      return response.success(
        res,
        uniqueNumberResponse.status,
        uniqueNumberResponse.data
      );
    } else {
      return response.fail(res, uniqueNumberResponse.status, "");
    }
  });
};

//GET setting access
exports.getUserTypeWiseAccess = async (req, res) => {
  const user_type = req.body.user_type;

  console.log("user_type-----", user_type);
  var sql = "";
  if (user_type == 1) {
    console.log("ifffffffff");
    // user_type = 1 means superadmin
    sql = `select mm.id as menu_id,mm.menu_desc,mm.menu_url,mm.parent_id,mm.sequence_no,mm.logo_image,mm.active
    from menu_masters mm
    where mm.active = 1 and mm.parent_id = 0
    order by mm.sequence_no`;
  } else {
    console.log("elseeeee");
    sql = `select mm.id as menu_id,mm.menu_desc,mm.menu_url,mm.parent_id,mm.sequence_no,mm.logo_image,mm.active,ma.create_access,ma.view_access,ma.listing_access
    from menu_masters mm
    left join user_access_managements ma on ma.menu_id = mm.id and ma.user_type_id = '${user_type}'
    where  mm.active = 1 and mm.parent_id = 0 
    order by mm.sequence_no`;
  }
  console.log("sql-----", sql);
  // return false;
  Model.sequelize
    .query(sql, {
      type: Model.sequelize.QueryTypes.SELECT,
    })
    .then(function (menumasterData) {
      if (menumasterData.length > 0) {
        //////////////////////////////
        var counter = 0;
        var mainItemArray = [];
        exports.getChildMenuDetailsFunction(
          menumasterData,
          user_type,
          counter,
          mainItemArray,
          function (getRestaurantWiseOrderDetailsFunctionData) {
            return response.success(
              res,
              "Menu Data",
              getRestaurantWiseOrderDetailsFunctionData
            );
          }
        );
      } else {
        return response.fail(res, "Not Found", "");
      }
    });
};
//GET setting access callback function
exports.getChildMenuDetailsFunction = function (
  menumasterData,
  user_type,
  counter,
  mainItemArray,
  childMenuInfoCallback
) {
  try {
    var data1 = JSON.stringify(menumasterData);
    var parseData = JSON.parse(data1);
    var singleMenumasterData = parseData[counter];
    var menu_id = singleMenumasterData.menu_id;
    var dataLength = parseData.length;
    /////////////////////////////
    var sqlQuery = ``;
    if (user_type == 1) {
      // user_type = 1 means superadmin
      sqlQuery = `select mm.id as menu_id,mm.menu_desc,mm.menu_url,mm.parent_id,mm.sequence_no,mm.logo_image,mm.active
      from menu_masters mm
      where mm.active = 1 and mm.parent_id = '${menu_id}'  and mm.parent_id != 0 order by mm.sequence_no `;
    } else {
      sqlQuery = `select mm.id as menu_id,mm.menu_desc,mm.menu_url,mm.parent_id,mm.sequence_no,mm.logo_image,mm.active,ma.create_access,ma.view_access,ma.listing_access
      from menu_masters mm
      left join user_access_managements ma on ma.menu_id = mm.id and ma.user_type_id='${user_type}'
      where mm.active = 1 and mm.parent_id = '${menu_id}'  and mm.parent_id != 0 order by mm.sequence_no `;
    }

    Model.sequelize
      .query(sqlQuery, {
        type: Model.sequelize.QueryTypes.SELECT,
      })
      .then((childMenuDetailsResponse) => {
        singleMenumasterData.childMenu = childMenuDetailsResponse;
        mainItemArray[counter] = singleMenumasterData;
        // console.log("mainItemArray---11>", mainItemArray);
        counter = parseInt(counter) + 1;
        if (parseInt(counter) < parseInt(dataLength)) {
          exports.getChildMenuDetailsFunction(
            menumasterData,
            user_type,
            counter,
            mainItemArray,
            childMenuInfoCallback
          );
        } else {
          childMenuInfoCallback(mainItemArray);
        }
      });
    ///////////////////////////////
  } catch (err) {
    // callback(null);
    console.log(err);
  }
};
//save setting access
exports.settingAccess = async (req, res) => {
  var moduleName = req.body.module;
  const user_type_id = req.body.user_type_id;
  const menuData = req.body.data;
  Model.sequelize
    .query(
      `select user_type_id
      from user_access_managements
      where user_type_id = '${user_type_id}'`,
      {
        type: Model.sequelize.QueryTypes.SELECT,
      }
    )
    .then(function (userAccesData) {
      if (userAccesData.length === 0) {
        var counter = 0;
        exports.settingAccessCreate(
          counter,
          user_type_id,
          moduleName,
          menuData,
          function (settingAccessCreateResponse) {
            if (settingAccessCreateResponse.code === 1) {
              return response.success(res, "Save Sucessfully.!");
            } else {
              return response.fail(res, settingAccessCreateResponse.data);
            }
          }
        );
      } else {
        var maincounter = 0;
        exports.settingAccessUpdate(
          maincounter,
          user_type_id,
          moduleName,
          menuData,
          function (settingAccessUpdateResponse) {
            if (settingAccessUpdateResponse.code === 1) {
              return response.success(res, "Updated Sucessfully.!");
            } else {
              return response.fail(res, settingAccessUpdateResponse.data);
            }
          }
        );
      }
    });
};
//save setting access callback function1
exports.settingAccessCreate = function (
  counter,
  user_type_id,
  moduleName,
  menuData,
  callback
) {
  const data11 = JSON.stringify(menuData);
  let menuDataPars = JSON.parse(data11);
  var dataLength = menuDataPars.length;
  var singleMenuData = menuDataPars[counter];

  const settingAccessData = {
    user_type_id: user_type_id,
    menu_id: singleMenuData.menu_id,
    create_access: singleMenuData.create_access,
    view_access: singleMenuData.view_access,
    listing_access: singleMenuData.listing_access,
  };

  Model[moduleName]
    .create(settingAccessData)
    .then((settingAccessDataResponse) => {
      let childMenuData = singleMenuData.childMenu;
      var index = 0;
      if (childMenuData.length != 0) {
        exports.settingAccessChildCreate(
          index,
          user_type_id,
          moduleName,
          childMenuData,
          function (settingAccessChildCreateRespomnse) {
            counter = parseInt(counter) + 1;
            if (parseInt(counter) < parseInt(dataLength)) {
              exports.settingAccessCreate(
                counter,
                user_type_id,
                moduleName,
                menuData,
                callback
              );
            } else {
              callback({ code: 1, status: "success", data: "" });
            }
          }
        );
      } else {
        counter = parseInt(counter) + 1;
        if (parseInt(counter) < parseInt(dataLength)) {
          exports.settingAccessCreate(
            counter,
            user_type_id,
            moduleName,
            menuData,
            callback
          );
        } else {
          callback({ code: 1, status: "success", data: "" });
        }
      }
    })
    .catch((err) => {
      callback({ code: 0, status: "Fail", data: err.message });
    });
};
//save setting access callback function2
exports.settingAccessChildCreate = function (
  index,
  user_type_id,
  moduleName,
  childMenuData,
  callback
) {
  const data11 = JSON.stringify(childMenuData);
  let childMenuDataPars = JSON.parse(data11);
  var dataLength = childMenuDataPars.length;
  var singleChildMenuData = childMenuDataPars[index];

  const singleChildMenu = {
    user_type_id: user_type_id,
    menu_id: singleChildMenuData.menu_id,
    create_access: singleChildMenuData.create_access,
    view_access: singleChildMenuData.view_access,
    listing_access: singleChildMenuData.listing_access,
  };

  Model[moduleName]
    .create(singleChildMenu)
    .then((singleChildMenuResponse) => {
      index = parseInt(index) + 1;
      if (parseInt(index) < parseInt(dataLength)) {
        exports.settingAccessChildCreate(
          index,
          user_type_id,
          moduleName,
          childMenuData,
          callback
        );
      } else {
        callback({ code: 1, status: "success", data: "" });
      }
    })
    .catch((err) => {
      console.log(err);
      callback({ code: 0, status: "fail", data: err.message });
    });
};

//Update setting access callback function1
exports.settingAccessUpdate = function (
  maincounter,
  user_type_id,
  moduleName,
  menuData,
  callback
) {
  const data11 = JSON.stringify(menuData);
  let menuDataPars = JSON.parse(data11);
  var dataLength = menuDataPars.length;
  var singleMenuData = menuDataPars[maincounter];

  const settingAccessData = {
    user_type_id: user_type_id,
    menu_id: singleMenuData.menu_id,
    create_access: singleMenuData.create_access,
    view_access: singleMenuData.view_access,
    listing_access: singleMenuData.listing_access,
  };
  console.log("settingAccessData===>", settingAccessData);
  Model[moduleName]
    .update(settingAccessData, {
      where: {
        user_type_id: user_type_id,
        menu_id: singleMenuData.menu_id,
      },
    })
    .then((settingAccessDataResponse) => {
      let childMenuData = singleMenuData.childMenu;
      var newindex = 0;
      if (childMenuData.length != 0) {
        exports.settingAccessChildUpdate(
          newindex,
          user_type_id,
          moduleName,
          childMenuData,
          function (settingAccessChildUpdateRespomnse) {
            maincounter = parseInt(maincounter) + 1;
            if (parseInt(maincounter) < parseInt(dataLength)) {
              exports.settingAccessUpdate(
                maincounter,
                user_type_id,
                moduleName,
                menuData,
                callback
              );
            } else {
              callback({ code: 1, status: "success", data: "" });
            }
          }
        );
      } else {
        maincounter = parseInt(maincounter) + 1;
        if (parseInt(maincounter) < parseInt(dataLength)) {
          exports.settingAccessUpdate(
            maincounter,
            user_type_id,
            moduleName,
            menuData,
            callback
          );
        } else {
          callback({ code: 1, status: "success", data: "" });
        }
      }
    })
    .catch((err) => {
      callback({ code: 0, status: "Fail", data: err.message });
    });
};
//Update setting access callback function2
exports.settingAccessChildUpdate = function (
  newindex,
  user_type_id,
  moduleName,
  childMenuData,
  callback
) {
  const data11 = JSON.stringify(childMenuData);
  let childMenuDataPars = JSON.parse(data11);
  var dataLength = childMenuDataPars.length;
  var singleChildMenuData = childMenuDataPars[newindex];

  const singleChildMenu = {
    user_type_id: user_type_id,
    menu_id: singleChildMenuData.menu_id,
    create_access: singleChildMenuData.create_access,
    view_access: singleChildMenuData.view_access,
    listing_access: singleChildMenuData.listing_access,
  };
  console.log("singleChildMenuUpdate===>", singleChildMenu);
  Model[moduleName]
    .update(singleChildMenu, {
      where: {
        user_type_id: user_type_id,
        menu_id: singleChildMenuData.menu_id,
      },
    })
    .then((singleChildMenuResponse) => {
      newindex = parseInt(newindex) + 1;
      if (parseInt(newindex) < parseInt(dataLength)) {
        exports.settingAccessChildUpdate(
          newindex,
          user_type_id,
          moduleName,
          childMenuData,
          callback
        );
      } else {
        callback({ code: 1, status: "success", data: "" });
      }
    })
    .catch((err) => {
      console.log(err);
      callback({ code: 0, status: "fail", data: err.message });
    });
};

//get getProjectTypeLevel
exports.getProjectTypeLevel = async (req, res) => {
  const id = req.body.id;
  Model.sequelize
    .query(
      `select * from project_type_levels
      where id='${id}' and parent_id = 0`,
      {
        type: Model.sequelize.QueryTypes.SELECT,
      }
    )
    .then(function (getProjectTypeLevelData) {
      var counter = 0;
      if (getProjectTypeLevelData.length == 0) {
        return response.fail(res, "Data Not Found");
      } else {
        var counter = 0;
        var mainArray = [];
        exports.getProjectTypeLevelSubChild(
          counter,
          mainArray,
          getProjectTypeLevelData,
          function (getProjectTypeLevelSubChildResponse) {
            // getProjectTypeLevelData.childData.push(
            //   getProjectTypeLevelSubChildResponse
            // );
            return response.success(
              res,
              "Project Type level Data",
              getProjectTypeLevelSubChildResponse
            );
          }
        );
      }
    });
};
//getProjectTypeLevelSubChild callback function1
exports.getProjectTypeLevelSubChild = function (
  counter,
  mainArray,
  getProjectTypeLevelData,
  callback
) {
  const data11 = JSON.stringify(getProjectTypeLevelData);
  let menuDataPars = JSON.parse(data11);
  var dataLength = menuDataPars.length;
  var singleProjectTypeLevelData = menuDataPars[counter];

  var id = singleProjectTypeLevelData.id;
  Model.sequelize
    .query(
      `select * from project_type_levels
      where parent_id = ${id} and is_sub_level = 1 and is_child = 1`,
      {
        type: Model.sequelize.QueryTypes.SELECT,
      }
    )
    .then((getProjectTypeLevelSubChildResponse) => {
      console.log(getProjectTypeLevelSubChildResponse);
      if (getProjectTypeLevelSubChildResponse.length != 0) {
        var index = 0;
        var newArray = [];
        exports.getProjectTypeLevelSubSubChild(
          index,
          getProjectTypeLevelSubChildResponse,
          newArray,
          function (getProjectTypeLevelSubSubChildResponse) {
            singleProjectTypeLevelData["childData"] =
              getProjectTypeLevelSubSubChildResponse;
            console.log(singleProjectTypeLevelData);

            // return response.success(res, getProjectTypeLevelSubSubChildResponse);
            mainArray[counter] = singleProjectTypeLevelData;
            counter = parseInt(counter) + 1;
            if (parseFloat(counter) < parseFloat(dataLength)) {
              exports.getProjectTypeLevelSubChild(
                counter,
                mainArray,
                getProjectTypeLevelData,
                callback
              );
            } else {
              // callback(mainArray);
              callback(singleProjectTypeLevelData);
            }
          }
        );
      } else {
        callback(singleProjectTypeLevelData);
      }
    })
    .catch((err) => {
      callback(0);
    });
};
//getProjectTypeLevelSubSubChild callback function2
exports.getProjectTypeLevelSubSubChild = function (
  index,
  getProjectTypeLevelSubChildResponse,
  newArray,
  callback
) {
  const data = JSON.stringify(getProjectTypeLevelSubChildResponse);
  let childDataPars = JSON.parse(data);
  var dataLength = childDataPars.length;
  var singleSubSubChildData = childDataPars[index];
  var id = singleSubSubChildData.id;

  // console.log("singleSubSubChildData======>", singleSubSubChildData);
  // return false;
  Model.sequelize
    .query(
      `select * from project_type_levels
    where parent_id = ${id} and is_sub_level = 0 and is_child = 0`,
      {
        type: Model.sequelize.QueryTypes.SELECT,
      }
    )
    .then((getProjectTypeLevelSubSubChildResponse) => {
      if (getProjectTypeLevelSubSubChildResponse.length != 0) {
        singleSubSubChildData["childData"] =
          getProjectTypeLevelSubSubChildResponse;

        newArray[index] = singleSubSubChildData;
        // console.log("newArray======>", newArray);

        index = parseInt(index) + 1;
        if (parseFloat(index) < parseFloat(dataLength)) {
          exports.getProjectTypeLevelSubSubChild(
            index,
            getProjectTypeLevelSubChildResponse,
            newArray,
            callback
          );
        } else {
          callback(newArray);
        }
      } else {
        callback(singleSubSubChildData);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getOmegaFromBermadNew = async (req, res) => {
  const endpoint = config.graphql_endpoint;
  const projectInputId = req.body.id;
  const project_type_id = req.body.project_type_id;
  const client = req.body.client;
  const contractor = req.body.contractor;
  const action = req.body.action; //create, update
  if (!projectInputId) {
    res.json({
      status: 200,
      code: 0,
      message: "Project id is required.",
    });
    return false;
  }

  const headers = {
    "content-type": "application/json",
    Authorization: config.graphql_authorization,
  };
  const graphqlQuery = {
    operationName: "getOmegasByProject",
    query: `query getOmegasByProject($id: String) {
      userProject(where: { id: $id }) {
       id
        project {
          id
          name
          type
          description
          units {
            id
            name
            lat
            long
            valves {
              id
              index
              name
              outputNum
              flow
            }
            analogInputs {
              id
              index
              name
              analogNum
            }
            digitalInput:waterMeters {
              id
              index
              name
              inputNum
            }
          }
        }
      }
    }
      `,
    variables: { id: projectInputId },
  };

  const options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(graphqlQuery),
  };

  const response1 = await fetch(endpoint, options);
  const data = await response1.json();

  // if (data.data.userProject != null) {
  if (data.data) {
    if (data.data.userProject) {
      const projectId = data.data.userProject.id;
      const project_name = data.data.userProject.project.name;
      if (projectId != "") {
        Model.sequelize.query(
          `select id, project_code from projects where project_code = '${projectInputId}' `, {
          type: Model.sequelize.QueryTypes.SELECT,
        }).then((checkProjectResponse) => {
          console.log("checkProjectResponse.length--------", checkProjectResponse.length);
          // return false;
          if (checkProjectResponse.length === 0) {
            const singleProjectPayloadData = {
              project_code: projectId,
              project_name: project_name,
              project_type_id: project_type_id,
              client: client,
              contractor: contractor,
            };
            Model.project.create(singleProjectPayloadData).then((singleProjectDataResponse) => {
              const omegaData = data.data.userProject.project.units;
              if (omegaData.length != 0 && singleProjectDataResponse.length != 0) {
                const newProjectId = singleProjectDataResponse.dataValues.id;
                const moduleName = "devices_master";
                var counter = 0;
                exports.createDeviceData(counter, newProjectId, moduleName, omegaData, function (createDeviceDataResponse) {
                  if (createDeviceDataResponse.code === 1) {
                    Model.sequelize.query(
                      `select id,device_name,lat,long, project_id from devices_masters where project_id = '${newProjectId}' order by id asc`,
                      {
                        type: Model.sequelize.QueryTypes.SELECT,
                      }).then((projectResponse) => {
                        return response.success(res, "Omega Data", projectResponse);
                      });
                  } else {
                    return response.fail(res, createDeviceDataResponse.data);
                  }
                }
                );
              } else {
                return response.fail(res, "No Records Found.!");
              }
            });
          } else {
            console.log("else-----------");

            // update data
            const omegaData = data.data.userProject.project.units; // omega
            if (omegaData.length != 0) {
              console.log("else ifffff-----------");
              const newProjectId = checkProjectResponse[0].id; // projectId
              const moduleName = "devices_master";
              var counter = 0;
              exports.updateDeviceData(counter, newProjectId, moduleName, omegaData, function (createDeviceDataResponse) {
                if (createDeviceDataResponse.code === 1) {
                  Model.sequelize.query(
                    `select id, project_id, device_name,lat,long, '${project_name}'as project_name from devices_masters where project_id = '${newProjectId}' order by id asc `, {
                    type: Model.sequelize.QueryTypes.SELECT,
                  }).then((projectResponse) => {
                    return response.success(res, "Omega Data", projectResponse);
                  });
                } else {
                  return response.fail(res, createDeviceDataResponse.data);
                }
              });
            } else {
              return response.fail(res, "No Records Found.!");
            }
            ////////////////////////////////////
          }
        });
      } else {
        return response.fail(res, "Project Id Not Found");
      }
    } else {
      var singleErrorDetailPayloadData = {
        error_code: 0,
        payload: JSON.stringify(graphqlQuery.variables),
        error_msg: "Project has empty data in cloud",
      };
      Model.error_log.create(singleErrorDetailPayloadData).then((result) => {
        return response.success(res, "Project has empty data in cloud", data);
      }).catch((err) => {
        console.log(err);
      });
    }
  } else {
    // return response.fail(res, "Data Not Found");
    var singleErrorDetailPayloadData = {
      error_code: 0,
      payload: JSON.stringify(graphqlQuery.variables),
      error_msg: data.errors[0].message,
    };

    // console.log("singleErrorDetailPayloadData", singleErrorDetailPayloadData);
    Model.error_log.create(singleErrorDetailPayloadData).then((result) => {
      return response.success(res, "Error logged in Database", data);
    }).catch((err) => {
      console.log(err);
    });
  }
};

//save devices master details callback function
exports.createDeviceData = function (counter, newProjectId, moduleName, omegaData, callback) {
  const data11 = JSON.stringify(omegaData);
  let childomegaDataPars = JSON.parse(data11);
  var dataLength = childomegaDataPars.length;
  var singleOmegaData = childomegaDataPars[counter];

  const singleOmegaPayloadData = {
    project_id: newProjectId,
    omega_id: singleOmegaData.id,
    device_name: singleOmegaData.name,
    lat: singleOmegaData.lat,
    long: singleOmegaData.long,
    active: 1,
  };

  Model[moduleName]
    .create(singleOmegaPayloadData)
    .then((singleOmegaDataResponse) => {
      if (singleOmegaDataResponse.length != 0 && singleOmegaData.valves != "") {
        ////callback
        var index = 0;
        const moduleNameNew = "devices_details";
        exports.createValveDeviceDetailData(
          index,
          moduleNameNew,
          singleOmegaData.valves,
          singleOmegaDataResponse,
          function (createValveDeviceDetailResponse) {
            if (
              createValveDeviceDetailResponse.length != 0 &&
              singleOmegaData.analogInputs != ""
            ) {
              ///////////////////////////////
              exports.createAnalogDeviceDetailData(
                index,
                moduleNameNew,
                singleOmegaData.analogInputs,
                singleOmegaDataResponse,
                function (createAnalogDeviceDetailResponse) {
                  if (
                    createAnalogDeviceDetailResponse.length != 0 &&
                    singleOmegaData.digitalInput != ""
                  ) {
                    exports.createDigitalDeviceDetailData(
                      index,
                      moduleNameNew,
                      singleOmegaData.digitalInput,
                      singleOmegaDataResponse,
                      function (createDeviceDataResponse) {
                        counter = parseInt(counter) + 1;
                        if (parseInt(counter) < parseInt(dataLength)) {
                          exports.createDeviceData(
                            counter,
                            newProjectId,
                            moduleName,
                            omegaData,
                            callback
                          );
                        } else {
                          callback({
                            code: 1,
                            status: "success",
                            data: createDeviceDataResponse,
                          });
                        }
                      }
                    );
                  } else {
                    counter = parseInt(counter) + 1;
                    if (parseInt(counter) < parseInt(dataLength)) {
                      exports.createDeviceData(
                        counter,
                        newProjectId,
                        moduleName,
                        omegaData,
                        callback
                      );
                    } else {
                      callback({
                        code: 1,
                        status: "Failed to create Analog Device data",
                        data: "",
                      });
                    }
                  }
                }
              );
              ///////////////////////////////
            } else {
              counter = parseInt(counter) + 1;
              if (parseInt(counter) < parseInt(dataLength)) {
                exports.createDeviceData(
                  counter,
                  newProjectId,
                  moduleName,
                  omegaData,
                  callback
                );
              } else {
                callback({
                  code: 1,
                  status: "Failed to create Valve Device data",
                  data: "",
                });
              }
            }
          }
        );
      } else {
        counter = parseInt(counter) + 1;
        if (parseInt(counter) < parseInt(dataLength)) {
          exports.createDeviceData(
            counter,
            newProjectId,
            moduleName,
            omegaData,
            callback
          );
        } else {
          callback({
            code: 1,
            status: "Failed to create device data",
            data: "",
          });
        }
      }
    })
    .catch((err) => {
      console.log(err);
      callback({ code: 0, status: "fail", data: err.message });
    });
};

//save valve device details callback function
exports.createValveDeviceDetailData = function (
  index,
  moduleNameNew,
  singleOmegaData,
  singleOmegaDataResponse,
  callback
) {
  const data11 = JSON.stringify(singleOmegaData);
  let childomegaDataPars = JSON.parse(data11);
  var dataLength = childomegaDataPars.length;
  var singleDeviceDetailData = singleOmegaData[index];
  var device_id = singleOmegaDataResponse.dataValues.id;

  var singleDeviceDetailPayloadData = {
    device_id: device_id,
    type: 1, //1: valves
    input_id: singleDeviceDetailData.id,
    name: singleDeviceDetailData.name,
    value: singleDeviceDetailData.outputNum,
    input_index: singleDeviceDetailData.index,
    flow: singleDeviceDetailData.flow,
  };

  Model[moduleNameNew]
    .create(singleDeviceDetailPayloadData)
    .then((DeviceDetailDataResponse) => {
      index = parseInt(index) + 1;
      if (parseInt(index) < parseInt(dataLength)) {
        exports.createValveDeviceDetailData(
          index,
          moduleNameNew,
          singleOmegaData,
          singleOmegaDataResponse,
          callback
        );
      } else {
        callback({
          code: 1,
          status: "success",
          data: DeviceDetailDataResponse,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      callback({ code: 0, status: "fail", data: err.message });
    });
};

//save analog device details callback function
exports.createAnalogDeviceDetailData = function (
  index,
  moduleNameNew,
  singleOmegaData,
  singleOmegaDataResponse,
  callback
) {
  const data11 = JSON.stringify(singleOmegaData);
  let childomegaDataPars = JSON.parse(data11);
  var dataLength = childomegaDataPars.length;
  var singleDeviceDetailData = singleOmegaData[index];
  // console.log("Omega Data---->", omegaData);
  console.log("singleDeviceDetailData--->", singleDeviceDetailData);
  // return false;
  var device_id = singleOmegaDataResponse.dataValues.id;
  // if (singleOmegaData.valves != '') {
  console.log("singleOmegaData.name Data1---->", singleDeviceDetailData);

  var singleDeviceDetailPayloadData = {
    device_id: device_id,
    type: 2, //2: Analog
    input_id: singleDeviceDetailData.id,
    input_index: singleDeviceDetailData.index,
    name: singleDeviceDetailData.name,
    value: singleDeviceDetailData.analogNum,
  };

  Model[moduleNameNew]
    .create(singleDeviceDetailPayloadData)
    .then((DeviceDetailDataResponse) => {
      index = parseInt(index) + 1;
      if (parseInt(index) < parseInt(dataLength)) {
        exports.createAnalogDeviceDetailData(
          index,
          moduleNameNew,
          singleOmegaData,
          singleOmegaDataResponse,
          callback
        );
      } else {
        callback({
          code: 1,
          status: "success",
          data: DeviceDetailDataResponse,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      callback({ code: 0, status: "fail", data: err.message });
    });
};

//save digital device details callback function
exports.createDigitalDeviceDetailData = function (
  index,
  moduleNameNew,
  singleOmegaData,
  singleOmegaDataResponse,
  callback
) {
  const data11 = JSON.stringify(singleOmegaData);
  let childomegaDataPars = JSON.parse(data11);
  var dataLength = childomegaDataPars.length;
  var singleDeviceDetailData = singleOmegaData[index];
  var device_id = singleOmegaDataResponse.dataValues.id;

  var singleDeviceDetailPayloadData = {
    device_id: device_id,
    type: 3, //3: digitalInput
    input_id: singleDeviceDetailData.id,
    input_index: singleDeviceDetailData.index,
    name: singleDeviceDetailData.name,
    value: singleDeviceDetailData.inputNum,
  };

  Model[moduleNameNew]
    .create(singleDeviceDetailPayloadData)
    .then((DeviceDetailDataResponse) => {
      index = parseInt(index) + 1;
      if (parseInt(index) < parseInt(dataLength)) {
        exports.createDigitalDeviceDetailData(
          index,
          moduleNameNew,
          singleOmegaData,
          singleOmegaDataResponse,
          callback
        );
      } else {
        callback({
          code: 1,
          status: "success",
          data: DeviceDetailDataResponse,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      callback({ code: 0, status: "fail", data: err.message });
    });
};

//update devices master details callback function
exports.updateDeviceData = function (
  counter,
  newProjectId,
  moduleName,
  omegaData,
  callback
) {
  const data11 = JSON.stringify(omegaData);
  let childomegaDataPars = JSON.parse(data11);
  var dataLength = childomegaDataPars.length;
  var singleOmegaData = childomegaDataPars[counter];

  const singleOmegaPayloadData = {
    project_id: newProjectId,
    omega_id: singleOmegaData.id,
    device_name: singleOmegaData.name,
    lat: singleOmegaData.lat,
    long: singleOmegaData.long,
  };
  // devices_master update
  Model[moduleName].update(singleOmegaPayloadData, {
    where: {
      project_id: newProjectId,
      omega_id: singleOmegaData.id,
    },
  }).then((singleOmegaDataResponse) => {
    // console.log("singleOmegaDataResponse===>", singleOmegaDataResponse); return false;
    if (singleOmegaDataResponse.length != 0) {
      Model.sequelize.query(
        `select id from devices_masters where project_id = '${newProjectId}' and omega_id='${singleOmegaData.id}' order by id asc `,
        {
          type: Model.sequelize.QueryTypes.SELECT,
        }).then((getDeviceIdData) => {
          if (getDeviceIdData.length != 0) {
            var index = 0;
            const moduleNameNew = "devices_details";
            exports.updateValveDeviceDetailData(
              index,
              moduleNameNew,
              singleOmegaData.valves,
              getDeviceIdData,
              function (updateValveDeviceDetailResponse) {
                if (updateValveDeviceDetailResponse.length != 0) {
                  ///////////////////////////////
                  exports.updateAnalogDeviceDetailData(
                    index,
                    moduleNameNew,
                    singleOmegaData.analogInputs,
                    getDeviceIdData,
                    function (updateAnalogDeviceDetailResponse) {
                      if (updateAnalogDeviceDetailResponse.length != 0) {
                        exports.updateDigitalDeviceDetailData(
                          index,
                          moduleNameNew,
                          singleOmegaData.digitalInput,
                          getDeviceIdData,
                          function (updateDeviceDataResponse) {
                            counter = parseInt(counter) + 1;
                            if (parseInt(counter) < parseInt(dataLength)) {
                              exports.updateDeviceData(
                                counter,
                                newProjectId,
                                moduleName,
                                omegaData,
                                callback
                              );
                            } else {
                              callback({
                                code: 1,
                                status: "success",
                                data: "",
                              });
                            }
                          }
                        );
                      } else {
                        counter = parseInt(counter) + 1;
                        if (parseInt(counter) < parseInt(dataLength)) {
                          exports.updateDeviceData(
                            counter,
                            newProjectId,
                            moduleName,
                            omegaData,
                            callback
                          );
                        } else {
                          callback({
                            code: 1,
                            status: "Failed to create Analog Device data",
                            data: "",
                          });
                        }
                      }
                    }
                  );
                  ///////////////////////////////
                } else {
                  counter = parseInt(counter) + 1;
                  if (parseInt(counter) < parseInt(dataLength)) {
                    exports.updateDeviceData(
                      counter,
                      newProjectId,
                      moduleName,
                      omegaData,
                      callback
                    );
                  } else {
                    callback({
                      code: 1,
                      status: "Failed to create Valve Device data",
                      data: "",
                    });
                  }
                }
              }
            );
          } else {
            exports.createDeviceData(
              counter,
              newProjectId,
              moduleName,
              omegaData,
              callback
            );
          }
        });
    } else {
      counter = parseInt(counter) + 1;
      if (parseInt(counter) < parseInt(dataLength)) {
        exports.updateDeviceData(
          counter,
          newProjectId,
          moduleName,
          omegaData,
          callback
        );
      } else {
        callback({
          code: 1,
          status: "Failed to create device data",
          data: "",
        });
      }
    }
  })
    .catch((err) => {
      console.log(err);
      callback({ code: 0, status: "fail", data: err.message });
    });
};

//update valve device details callback function
exports.updateValveDeviceDetailData = function (
  index,
  moduleNameNew,
  singleOmegaData,
  getDeviceIdData,
  callback
) {
  const data11 = JSON.stringify(singleOmegaData);
  let childomegaDataPars = JSON.parse(data11);
  var dataLength = childomegaDataPars.length;
  var singleDeviceDetailData = singleOmegaData[index];
  var device_id = getDeviceIdData[0].id; //getDeviceIdData[index].id;
  console.log("device_id====>", device_id);
  console.log("getDeviceIdData====>", getDeviceIdData);

  var singleDeviceDetailPayloadData = {
    device_id: device_id,
    type: 1, //1: valves
    name: singleDeviceDetailData.name,
    value: singleDeviceDetailData.outputNum,
    input_index: singleDeviceDetailData.index,
    flow: singleDeviceDetailData.flow,
  };

  console.log("singleDeviceDetailPayloadData", singleDeviceDetailPayloadData);

  //return false;
  /*Model.sequelize
    .query(
      `select id from devices_details where name = '${singleDeviceDetailData.name}' and value = '${singleDeviceDetailData.outputNum}' and device_id='${device_id}'`,
      {
        type: Model.sequelize.QueryTypes.SELECT,
      }
    )*/
  Model.devices_details
    .findOne({
      attributes: ["id"],
      where: {
        //  name: singleDeviceDetailData.name,
        // value: singleDeviceDetailData.outputNum,
        input_id: singleDeviceDetailData.id,
        device_id: String(device_id),
      },
    })
    .then((getDeviceDetailsIdData) => {
      //  var deviceDetailId = getDeviceDetailsIdData[0].id;
      console.log("getDeviceDetailsIdData", getDeviceDetailsIdData.id);
      //  return false;
      var deviceDetailId = getDeviceDetailsIdData.id;
      Model[moduleNameNew]
        .update(singleDeviceDetailPayloadData, {
          where: {
            device_id: device_id,
            id: deviceDetailId,
          },
        })
        .then((DeviceDetailDataResponse) => {
          //  return false;
          index = parseInt(index) + 1;
          if (parseInt(index) < parseInt(dataLength)) {
            exports.updateValveDeviceDetailData(
              index,
              moduleNameNew,
              singleOmegaData,
              getDeviceIdData,
              callback
            );
          } else {
            callback({
              code: 1,
              status: "success",
              data: DeviceDetailDataResponse,
            });
          }
        })
        .catch((err) => {
          console.log(err);
          callback({ code: 0, status: "fail", data: err.message });
        });
    });
};

//update analog device details callback function
exports.updateAnalogDeviceDetailData = function (
  index,
  moduleNameNew,
  singleOmegaData,
  getDeviceIdData,
  callback
) {
  const data11 = JSON.stringify(singleOmegaData);
  let childomegaDataPars = JSON.parse(data11);
  var dataLength = childomegaDataPars.length;
  var singleDeviceDetailData = singleOmegaData[index];
  var device_id = getDeviceIdData[0].id; //getDeviceIdData[index].id;
  console.log("singleDeviceDetailDataresponse", singleDeviceDetailData);
  var singleDeviceDetailPayloadData = {
    device_id: device_id,
    type: 2, //2: Analog
    input_index: singleDeviceDetailData.index,
    name: singleDeviceDetailData.name,
    value: singleDeviceDetailData.analogNum,
  };
  /* Model.sequelize
    .query(
      `select id from devices_details where name = '${singleDeviceDetailData.name}' and value = '${singleDeviceDetailData.analogNum}'`,
      {
        type: Model.sequelize.QueryTypes.SELECT,
      }
    )*/
  Model.devices_details
    .findOne({
      attributes: ["id"],
      where: {
        //name: singleDeviceDetailData.name,
        //value: singleDeviceDetailData.analogNum,
        input_id: singleDeviceDetailData.id,
        device_id: String(device_id),
      },
    })
    .then((getDeviceDetailsIdData) => {
      // var deviceDetailId = getDeviceDetailsIdData[0].id;
      var deviceDetailId = getDeviceDetailsIdData.id;
      Model[moduleNameNew]
        .update(singleDeviceDetailPayloadData, {
          where: {
            device_id: device_id,
            id: deviceDetailId,
          },
        })
        .then((DeviceDetailDataResponse) => {
          index = parseInt(index) + 1;
          if (parseInt(index) < parseInt(dataLength)) {
            exports.updateAnalogDeviceDetailData(
              index,
              moduleNameNew,
              singleOmegaData,
              getDeviceIdData,
              callback
            );
          } else {
            callback({
              code: 1,
              status: "success",
              data: DeviceDetailDataResponse,
            });
          }
        })
        .catch((err) => {
          console.log(err);
          callback({ code: 0, status: "fail", data: err.message });
        });
    });
};

//update digital device details callback function
exports.updateDigitalDeviceDetailData = function (
  index,
  moduleNameNew,
  singleOmegaData,
  getDeviceIdData,
  callback
) {
  const data11 = JSON.stringify(singleOmegaData);
  let childomegaDataPars = JSON.parse(data11);
  var dataLength = childomegaDataPars.length;
  var singleDeviceDetailData = singleOmegaData[index];
  var device_id = getDeviceIdData[0].id; //getDeviceIdData[index].id;
  console.log("getDeviceIdDatadigital", getDeviceIdData);
  //return false;
  var singleDeviceDetailPayloadData = {
    device_id: device_id,
    type: 3, //3: digitalInput
    name: singleDeviceDetailData.name,
    value: singleDeviceDetailData.inputNum,
    input_index: singleDeviceDetailData.index,
  };

  /*Model.sequelize
    .query(
      `select id from devices_details where name = '${singleDeviceDetailData.name}' and value = '${singleDeviceDetailData.inputNum}'`,
      {
        type: Model.sequelize.QueryTypes.SELECT,
      }
    )*/
  Model.devices_details
    .findOne({
      attributes: ["id"],
      where: {
        //name: singleDeviceDetailData.name,
        // value: singleDeviceDetailData.inputNum,
        input_id: singleDeviceDetailData.id,
        device_id: String(device_id),
      },
    })
    .then((getDeviceDetailsIdData) => {
      //var deviceDetailId = getDeviceDetailsIdData[0].id;
      var deviceDetailId = getDeviceDetailsIdData.id;
      Model[moduleNameNew]
        .update(singleDeviceDetailPayloadData, {
          where: {
            device_id: device_id,
            id: deviceDetailId,
          },
        })
        .then((DeviceDetailDataResponse) => {
          index = parseInt(index) + 1;
          if (parseInt(index) < parseInt(dataLength)) {
            exports.updateDigitalDeviceDetailData(
              index,
              moduleNameNew,
              singleOmegaData,
              getDeviceIdData,
              callback
            );
          } else {
            callback({
              code: 1,
              status: "success",
              data: DeviceDetailDataResponse,
            });
          }
        })
        .catch((err) => {
          console.log(err);
          callback({ code: 0, status: "fail", data: err.message });
        });
    });
};

//getOmegaDetails
exports.getOmegaDetails = async (req, res) => {
  const device_id = req.body.device_id;

  Model.sequelize
    .query(
      `select id, type, input_id, name, value, device_id, input_index as index from devices_details where device_id = '${device_id}' order by name asc`,
      {
        type: Model.sequelize.QueryTypes.SELECT,
      }
    )
    .then(function (deviceDetailsData) {
      console.log("deviceDetailsData", deviceDetailsData);
      if (deviceDetailsData.length != 0) {
        const deviceDetailsArray = [];
        const deviceDetailsArray1 = [];
        const deviceDetailsArray2 = [];
        const deviceDetailsArray3 = [];
        for (let index = 0; index < deviceDetailsData.length; index++) {
          if (deviceDetailsData[index].type === 1) {
            deviceDetailsArray1.push({
              id: deviceDetailsData[index].id,
              valve_id: deviceDetailsData[index].input_id,
              name: deviceDetailsData[index].name,
              value: deviceDetailsData[index].value,
              type: deviceDetailsData[index].type,
              index: deviceDetailsData[index].index,
            });
          } else if (deviceDetailsData[index].type === 2) {
            deviceDetailsArray2.push({
              id: deviceDetailsData[index].id,
              analog_id: deviceDetailsData[index].input_id,
              name: deviceDetailsData[index].name,
              value: deviceDetailsData[index].value,
              type: deviceDetailsData[index].type,
              index: deviceDetailsData[index].index,
            });
          } else {
            deviceDetailsArray3.push({
              id: deviceDetailsData[index].id,
              digital_id: deviceDetailsData[index].input_id,
              name: deviceDetailsData[index].name,
              value: deviceDetailsData[index].value,
              type: deviceDetailsData[index].type,
              index: deviceDetailsData[index].index,
            });
          }
        }
        deviceDetailsArray.push({
          device_id: device_id,
          valves: deviceDetailsArray1,
          analogInput: deviceDetailsArray2,
          digitalInput: deviceDetailsArray3,
        });
        return response.success(
          res,
          "Device Detail Data.!",
          deviceDetailsArray
        );
      } else {
        return response.fail(res, "Data Not Found ");
      }
    });
};

//GET setting access
exports.getProjectWiseAccess = async (req, res) => {
  const project_id = req.body.project_id;
  Model.sequelize
    .query(
      `select um.id as user_id, concat(um.first_name,' ',um.last_name) as name, access from user_masters um
      left join project_access_managements pm ON um.id=pm.user_id and pm.project_id='${project_id}' order by name asc`,
      {
        type: Model.sequelize.QueryTypes.SELECT,
      }
    )
    .then(function (ProjectWiseAccessData) {
      if (ProjectWiseAccessData.length > 0) {
        //////////////////////////////
        return response.success(
          res,
          "Project Access Data",
          ProjectWiseAccessData
        );
      } else {
        return response.fail(res, "Not Found", "");
      }
    });
};

exports.updateProjectWiseAccess = (req, res) => {
  var project_id = req.body.project_id;
  var accessDetails = req.body.accessDetails;
  //// callback function
  var index = 0;
  exports.projectAccessFunction(
    index,
    project_id,
    accessDetails,
    function (AccessResponse) {
      if (AccessResponse.status == 1) {
        res.json({
          status: 200,
          code: 1,
          message: AccessResponse.message,
        });
      } else {
        res.json({
          status: 200,
          code: 0,
          message: "There is error while update",
        });
      }
    }
  );
};

exports.projectAccessFunction = (
  index,
  project_id,
  accessDetails,
  callback
) => {
  const stringifyData = JSON.stringify(accessDetails);
  const parseData = JSON.parse(stringifyData);
  var dataLength = parseData.length; //2
  var singleItemData = parseData[index]; //single item
  var user_id = singleItemData.user_id;
  var access = singleItemData.access;
  Model.sequelize
    .query(
      `select * from project_access_managements 
     where project_id='${project_id}' and user_id=${user_id}`,
      {
        type: Model.sequelize.QueryTypes.SELECT,
      }
    )
    .then(function (ProjectWiseAccessData) {
      if (ProjectWiseAccessData.length == 0) {
        //insert code
        var userData = {
          project_id: project_id,
          user_id: user_id,
          access: access,
        };
        Model.project_access_management.create(userData).then((result) => {
          //// increment
          index = parseInt(index) + 1;
          if (parseFloat(index) < parseFloat(dataLength)) {
            exports.projectAccessFunction(
              index,
              project_id,
              accessDetails,
              callback
            );
          } else {
            callback({ status: 1, message: "Access Created" });
          }
        });
      } else {
        //update code
        var id = ProjectWiseAccessData[0].id;
        var userData = {
          project_id: project_id,
          user_id: user_id,
          access: access,
        };
        Model.project_access_management
          .update(userData, {
            where: {
              id: id,
            },
          })
          .then((result) => {
            //// increment
            index = parseInt(index) + 1;
            if (parseFloat(index) < parseFloat(dataLength)) {
              exports.projectAccessFunction(
                index,
                project_id,
                accessDetails,
                callback
              );
            } else {
              callback({ status: 1, message: "Access Updated" });
            }
          });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getZoneSubZone = async (req, res) => {
  const device_id = req.body.device_id;
  Model.sequelize
    .query(
      `select zm.id, zm.zone_name as name, '2' as type from zone_masters zm left join zone_devices zd ON zm.id=zd.zone_id where zd.device_id='${device_id}'`, // 2 for zone device_reference
      {
        type: Model.sequelize.QueryTypes.SELECT,
      }
    )
    .then(function (ZoneData) {
      if (ZoneData.length > 0) {
        //////////////////////////////
        return response.success(res, "Zone Data", ZoneData);
      } else {
        Model.sequelize
          .query(
            `select zm.id, zm.sub_zone_name as name, '3' as type from sub_zone_masters zm left join sub_zone_devices zd ON zm.id=zd.sub_zone_id where zd.device_id='${device_id}'`, // 3 for sub zone device_reference
            {
              type: Model.sequelize.QueryTypes.SELECT,
            }
          )
          .then(function (SubZoneData) {
            if (SubZoneData.length > 0) {
              //////////////////////////////
              return response.success(res, "Sub Zone Data", SubZoneData);
            } else {
              Model.sequelize
                .query(
                  `select dp.id, dp.device_name as name, '1' as type from device_profiles dp left join device_profile_details dpd ON dpd.device_profile_id=dp.id where dpd.device_id='${device_id}'`, // 1 for sub zone device_reference
                  {
                    type: Model.sequelize.QueryTypes.SELECT,
                  }
                )
                .then(function (SubZoneData) {
                  if (SubZoneData.length > 0) {
                    //////////////////////////////
                    return response.success(
                      res,
                      "Device Profile Data",
                      SubZoneData
                    );
                  } else {
                    return response.fail(res, "Data Not Found", "");
                  }
                });
            }
          });
        // return response.fail(res, "Not Found", "");
      }
    });
};

//Scheduling API - Get Programs
exports.getPrograms = async (req, res) => {
  const project_id = req.body.project_id;
  const omega_id = req.body.omega_id;
  Model.sequelize
    .query(
      `SELECT id, omega_id, program_name, CASE
      WHEN (status = 1) Then 'ACTIVE'
      WHEN (status = 2)  Then 'DELETED'
      Else 'NON-ACTIVE'
     END AS status,
     CASE
      WHEN (type = 1) Then 'WEEKLY'
      WHEN (type = 2)  Then 'CYCLIC'
      Else ''
     END AS type,
      CASE
      WHEN (measurementype = 1) Then 'Quantity'
      WHEN (measurementype = 2)  Then 'Duration'
      Else ''
     END AS measurementype, 
     program_index, "cycleTypeIsCyclic", "hourlyStart", "hourlyEnd", "cyclePerDay", "endTimeMode", "allowedHoursStart", "cycleDayStartHour", "cycleIntervalDays", "cycleIntervalHours", "irrigationDays", "startDate", created_by, updated_by, description, "valveId", "order", amount, "allowedHoursEnd", "cycleTypeHours", project_id, device_id, bermad_program_id, "createdAt", "updatedAt", program_status
      FROM public.programs where project_id='${project_id}' and omega_id='${omega_id}' and status!=2 order by id asc`, //status 2 means programs which are deleted won't come in the list
      {
        type: Model.sequelize.QueryTypes.SELECT,
      }
    )
    .then(function (ProgramsData) {
      if (ProgramsData.length > 0) {
        //////////////////////////////
        // return response.success(res, "Programs Data", ProgramsData);
        var index = 0;
        var mainArray = [];
        exports.getProgramAmountDetail(
          index,
          ProgramsData,
          mainArray,
          function (response) {
            // callback function end
            res.json({
              status: 200,
              code: 1,
              message: "Programs Data",
              data: response,
            });
          }
        );
      } else {
        return response.fail(res, "No Records Found");
      }
    });
};

exports.getProgramAmountDetail = (index, ProgramsData, mainArray, callback) => {
  try {
    const data1 = JSON.stringify(ProgramsData);
    const parseData = JSON.parse(data1);
    var dataLength = parseData.length;
    var singleData = parseData[index];
    // console.log("singleData--->", singleData); return false;
    var program_id = singleData.id;
    Model.sequelize
      .query(
        `select pa.*,dm.name from programs_amounts pa
        left join devices_details dm on dm.id = pa.valve_id WHERE program_id = '${program_id}' ;`,
        {
          type: Model.sequelize.QueryTypes.SELECT,
        }
      )
      .then((ProgramsAmountResponse) => {
        singleData.ProgramsAmountData = ProgramsAmountResponse;
        mainArray[index] = singleData;
        index = parseInt(index) + 1;
        if (parseInt(index) < parseInt(dataLength)) {
          exports.getProgramAmountDetail(
            index,
            ProgramsData,
            mainArray,
            callback
          );
        } else {
          callback(mainArray);
        }
      });
  } catch (err) {
    // callback(null);
    console.log(err);
  }
};

exports.getPrograms1 = async (req, res) => {
  const endpoint = config.graphql_endpoint;
  const headers = {
    "content-type": "application/json",
    Authorization: config.graphql_authorization,
  };
  const graphqlQuery = {
    operationName: "getOmega",
    query: `query getOmega($id:String!){

      unit(where:{id:$id}){
    
        id
    
        name
    
        lat
    
        long
    
        programs {
          id
    
          name
    
          status
    
          type
    
          index
    
          cycleTypeIsCyclic
    
          hourlyStart
    
          hourlyEnd

          cycleTypeHours
    
          cyclePerDay
    
          endTimeMode
    
          measurementType
    
          allowedHoursStart
    
          cycleDayStartHour
    
          cycleIntervalDays
    
          cycleIntervalHours
    
          irrigationDays
    
          startDate
    
          programAmount {
    
            amount
    
            valve {
    
              name
    
              id
    
            }
    
          }
    
        }
    
      }
    
    }
      `,

    variables: { id: req.body.id },
  };

  const options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(graphqlQuery),
  };
  const response1 = await fetch(endpoint, options);
  const data = await response1.json();
  // if (data.data.unit != null) {
  if (data.data) {
    return response.success(res, "Programs Data", data.data);
  } else {
    console.log("data==>", data);
    // return response.fail(res, "Data Not Found",data);
    var singleErrorDetailPayloadData = {
      error_code: 0,
      payload: JSON.stringify(graphqlQuery.variables),
      error_msg: data.errors[0].message,
    };

    // console.log("singleErrorDetailPayloadData", singleErrorDetailPayloadData);
    Model.error_log
      .create(singleErrorDetailPayloadData)
      .then((result) => {
        return response.success(res, "Error logged in Database", data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

exports.ProgramsSynchronise = async (req, res) => {
  const endpoint = config.graphql_endpoint;
  const headers = {
    "content-type": "application/json",
    Authorization: config.graphql_authorization,
  };
  const graphqlQuery = {
    operationName: "getOmega",
    query: `query getOmega($id:String!){

      unit(where:{id:$id}){
    
        id
    
        name
    
        lat
    
        long
    
        programs {
          id
    
          name

          description
    
          status
    
          type
    
          index
    
          cycleTypeIsCyclic
    
          hourlyStart
    
          hourlyEnd

          cycleTypeHours
    
          cyclePerDay
    
          endTimeMode
    
          measurementType
    
          allowedHoursStart
    
          cycleDayStartHour
    
          cycleIntervalDays
    
          cycleIntervalHours
    
          irrigationDays
    
          startDate
    
          programAmount {
    
            amount
    
            valve {
    
              name
    
              id
    
            }
    
          }
    
        }
    
      }
    
    }
      `,

    variables: { id: req.body.omega_id },
  };

  const options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(graphqlQuery),
  };
  const response1 = await fetch(endpoint, options);
  const data = await response1.json();
  if (data.data) {
    console.log(data.data.unit.programs);
    var project_id = req.body.project_id;
    var omega_id = req.body.omega_id;
    var device_id = req.body.device_id;
    var programs = data.data.unit.programs;
    //// callback function
    var index = 0;
    exports.programSyncFunction(
      index,
      project_id,
      omega_id,
      device_id,
      programs,
      function (AccessResponse) {
        if (AccessResponse.status == 1) {
          res.json({
            status: 200,
            code: 1,
            message: AccessResponse.message,
          });
        } else {
          res.json({
            status: 200,
            code: 0,
            message: "There is error while update",
          });
        }
      }
    );
  } else {
    console.log("data==>", data);
    var singleErrorDetailPayloadData = {
      error_code: 0,
      payload: JSON.stringify(graphqlQuery.variables),
      error_msg: data.errors[0].message,
    };

    // console.log("singleErrorDetailPayloadData", singleErrorDetailPayloadData);
    Model.error_log
      .create(singleErrorDetailPayloadData)
      .then((result) => {
        return response.success(res, "Error logged in Database", data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

exports.programSyncFunction = (
  index,
  project_id,
  omega_id,
  device_id,
  programs,
  callback
) => {
  const stringifyData = JSON.stringify(programs);
  const parseData = JSON.parse(stringifyData);
  var dataLength = parseData.length; //2
  var singleItemData = parseData[index]; //single item
  var programsAmountdata = singleItemData.programAmount;
  singleItemData["project_id"] = project_id;
  singleItemData["omega_id"] = omega_id;
  singleItemData["device_id"] = device_id;
  singleItemData["bermad_program_id"] = singleItemData.id;
  delete singleItemData.id;
  var changedStatus = 0;
  var changedType = 0;
  var changedMeasurementType = 0;
  var program_name = "";
  var program_index = 0;

  //program name
  if (singleItemData.name) {
    program_name = singleItemData.name;
    delete singleItemData.name;
  }

  //program index
  if (singleItemData.index) {
    program_index = singleItemData.index;
    delete singleItemData.index;
  }

  //status
  if (singleItemData.status) {
    if (singleItemData.status == "ACTIVE") {
      changedStatus = 1;
    } else if (singleItemData.status == "DELETED") {
      changedStatus = 2;
    } else {
      changedStatus = 0;
    }
    delete singleItemData.status;
  }

  //type
  if (singleItemData.type) {
    if (singleItemData.type == "CYCLIC") {
      changedType = 2;
    } else {
      changedType = 1;
    }
    delete singleItemData.type;
  }

  //measurementType
  if (singleItemData.measurementType) {
    if (singleItemData.measurementType == "Duration") {
      changedMeasurementType = 2;
    } else {
      changedMeasurementType = 1;
    }
    delete singleItemData.measurementType;
  }

  // if (singleItemData.status) {
  singleItemData["status"] = changedStatus;
  // }
  // if (singleItemData.type) {
  singleItemData["type"] = changedType;
  //  }
  //  if (singleItemData.measurementType) {
  singleItemData["measurementype"] = changedMeasurementType;
  //  }
  singleItemData["program_name"] = program_name;
  singleItemData["program_index"] = program_index;
  //console.log("omega_id", omega_id);
  console.log("singleItemData", singleItemData);
  console.log("dataLength", dataLength);
  //return false;
  Model.sequelize
    .query(
      `SELECT * FROM programs where omega_id='${omega_id}' and bermad_program_id='${singleItemData["bermad_program_id"]}'`,
      {
        type: Model.sequelize.QueryTypes.SELECT,
      }
    )
    .then(function (ProgramsData) {
      if (ProgramsData.length == 0) {
        //insert code
        Model.programs.create(singleItemData).then((programsresult) => {
          var program_id = programsresult.id;
          //// increment
          index = parseInt(index) + 1;
          /*exports.programsAmountSyncFunction(
              program_id,
              programsAmount,
              function (AccessResponse) {}
            );*/
          //delete code
          console.log("program_id", program_id);
          Model.programs_amount.destroy({
            where: { program_id: program_id },
          });
          //insert code
          if (programsAmountdata) {
            programsAmountdata.forEach((element) => {
              Model.devices_details
                .findOne({
                  attributes: ["id"],
                  where: { input_id: element.valve.id, type: 1 },
                })
                .then((device_details) => {
                  var valveid = device_details.id;
                  var amountData = {
                    program_id: program_id,
                    bermad_valve_id: element.valve.id,
                    valve_id: valveid,
                    amount: element.amount,
                    order: element.order,
                  };
                  Model.programs_amount.create(amountData).then((result) => {
                    //// increment
                  });
                })
                .catch((err) => { });
            });
          }

          /*  programsAmount.forEach((element) => {
            var amountData = {
              program_id: program_id,
              bermad_valve_id: element.valve.id,
              amount: element.amount,
            };
            Model.programs_amount.create(amountData).then((result) => {
              //// increment
            });
          });*/
          if (parseFloat(index) < parseFloat(dataLength)) {
            exports.programSyncFunction(
              index,
              project_id,
              omega_id,
              device_id,
              programs,
              callback
            );
          } else {
            callback({ status: 1, message: "Program Created" });
          }
        });
      } else {
        //update code
        var id = ProgramsData[0].id;
        console.log("program_update_id", id);
        // return false;
        Model.programs
          .update(singleItemData, {
            where: {
              id: id,
            },
          })
          .then((result) => {
            //// increment
            index = parseInt(index) + 1;
            /*exports.programsAmountSyncFunction(
              program_id,
              programsAmount,
              function (AccessResponse) {}
            );*/
            console.log("program_id", id);
            Model.programs_amount.destroy({
              where: { program_id: id },
            });
            //insert code
            //insert code
            if (programsAmountdata) {
              programsAmountdata.forEach((element) => {
                Model.devices_details
                  .findOne({
                    attributes: ["id"],
                    where: { input_id: element.valve.id, type: 1 },
                  })
                  .then((device_details) => {
                    var valveid = device_details.id;
                    var amountData = {
                      program_id: id,
                      bermad_valve_id: element.valve.id,
                      valve_id: valveid,
                      amount: element.amount,
                      order: element.order,
                    };
                    Model.programs_amount.create(amountData).then((result) => {
                      //// increment
                    });
                  })
                  .catch((err) => { });
              });
            }
            /*  programsAmount.forEach((element) => {
              var amountData = {
                program_id: id,
                bermad_valve_id: element.valve.id,
                amount: element.amount,
              };
              Model.programs_amount.create(amountData).then((result) => {
                //// increment
              });
            });*/
            if (parseFloat(index) < parseFloat(dataLength)) {
              exports.programSyncFunction(
                index,
                project_id,
                omega_id,
                device_id,
                programs,
                callback
              );
            } else {
              callback({ status: 1, message: "Program Updated" });
            }
          });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.programsAmountSyncFunction = (program_id, programsAmount) => {
  var dataLength = programsAmount.length; //2
  // console.log(programsAmount[0].valve);
  console.log("program_id", program_id);
  //  return false;

  /*Model.sequelize
    .query(
      `select * from programs_amounts 
     where program_id='${program_id}' '`,
      {
        type: Model.sequelize.QueryTypes.SELECT,
      }
    )
    .then(function (ProjectWiseAccessData) {*/
  Model.programs_amount
    .destroy({
      where: { program_id: program_id },
    })
    .then((num) => {
      // if (num == 1) {
      //insert code
      programsAmount.forEach((element) => {
        var amountData = {
          program_id: program_id,
          valveid: element.valve.id,
          amount: element.amount,
        };
        Model.programs_amount.create(amountData).then((result) => {
          //// increment
        });
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Content with id=" + id,
      });
    });
  /* })
    .catch((err) => {
      console.log(err);
    });*/
};

exports.getFarmerDetails = async (req, res) => {
  const farmer_id = req.body.farmer_id;
  Model.sequelize
    .query(
      `select fd.*, dm.device_name, dd.name as valve_name,zm.zone_name, sm.sub_zone_name, dfm.device_name as profile_name from farmer_details fd 
      inner join devices_masters dm ON  fd.device_id=dm.id
      inner join devices_details dd ON fd.valve_id=dd.id
      Left join zone_masters zm ON fd.device_relationship_referance_id=zm.id 
      Left join sub_zone_masters sm ON fd.device_relationship_referance_id=sm.id 
      Left join device_profiles dfm ON fd.device_relationship_referance_id=dfm.id
      where farmer_id='${farmer_id}'`,
      {
        type: Model.sequelize.QueryTypes.SELECT,
      }
    )
    .then(function (FarmerData) {
      if (FarmerData.length > 0) {
        //////////////////////////////
        return response.success(res, "Farmer Data", FarmerData);
      } else {
        return response.fail(res, "No Records Found");
      }
    });
};

exports.deleteRecordById = (req, res) => {
  const id = req.body.id;
  const module = req.body.module;
  if (Model[module]) {
    Model[module]
      .destroy({
        where: { id: id },
      })
      .then((num) => {
        if (num == 1) {
          return response.success(res, "Record deleted successfully!");
        } else {
          return response.fail(
            res,
            "Cannot delete Content with id=${id}. Maybe Record was not found!"
          );
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "Could not delete Content with id=" + id,
        });
      });
  } else {
    return response.fail(res, "Invalid Model Name", "");
  }
};

exports.createOneProgram = async (req, res) => {
  const endpoint = config.graphql_endpoint;
  const headers = {
    "content-type": "application/json",
    Authorization: config.graphql_authorization,
  };
  const graphqlQuery = {
    operationName: "createFullProgram",
    query: `mutation createFullProgram($id: String!, $name: String, $description: String, $cycleTypeIsCyclic: Boolean, $hourlyEnd: Int, $cyclePerDay: Int, $endTimeMode: Boolean, $hourlyStart: Int, $cycleTypeHours: ProgramCreatecycleTypeHoursInput, $allowedHoursEnd: Int, $measurementType: Measurement_Type, $allowedHoursStart: Int, $cycleDayStartHour: Int, $cycleIntervalDays: Int, $cycleIntervalHours: Int, $irrigationDays: Int, $startDate: DateTime, $programAmount: ProgramAmountCreateNestedManyWithoutProgramInput, $type: ProgramType!, $status: ProgramStatus) {
      createOneProgram(
        data: {name:$name, description: $description, cycleTypeIsCyclic: $cycleTypeIsCyclic, hourlyEnd: $hourlyEnd, cyclePerDay: $cyclePerDay, endTimeMode: $endTimeMode, hourlyStart: $hourlyStart, cycleTypeHours: $cycleTypeHours, allowedHoursEnd: $allowedHoursEnd, measurementType: $measurementType, allowedHoursStart: $allowedHoursStart, cycleDayStartHour: $cycleDayStartHour, cycleIntervalDays: $cycleIntervalDays, cycleIntervalHours: $cycleIntervalHours, irrigationDays: $irrigationDays, startDate: $startDate, programAmount: $programAmount, type: $type, status: $status, unit: {connect: {id: $id}}}
      ) {
        id
        index
        name
        unit {
          id
          __typename
          programs {
            id
            name
            __typename
          }
        }
        __typename
      }
    }
      `,

    variables: {
      allowedHoursEnd: req.body.data.allowedHoursEnd,
      allowedHoursStart: req.body.data.allowedHoursStart,
      cycleDayStartHour: req.body.data.cycleDayStartHour,
      cycleIntervalDays: req.body.data.cycleIntervalDays,
      cycleIntervalHours: req.body.data.cycleIntervalHours,
      cyclePerDay: req.body.data.cyclePerDay,
      cycleTypeHours: {
        set: [],
      },
      cycleTypeIsCyclic: req.body.data.cycleTypeIsCyclic,
      endTimeMode: req.body.data.endTimeMode,
      hourlyEnd: req.body.data.hourlyEnd,
      hourlyStart: req.body.data.hourlyStart,
      // id: req.body.id,
      id: req.body.data.omega_id,
      irrigationDays: req.body.data.irrigationDays,
      measurementType: req.body.data.measurementType,
      // name: req.body.data.name,
      name: req.body.data.program_name,
      description: req.body.data.description,
      programAmount: {
        create: [
          {
            amount: req.body.data.amount,
            order: req.body.data.order,
            valve: {
              connect: {
                id: req.body.data.bermad_valve_id,
              },
            },
          },
        ],
      },
      startDate: req.body.data.startDate,
      status: req.body.data.status,
      type: req.body.data.type,
    },
  };

  const options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(graphqlQuery),
  };
  const response1 = await fetch(endpoint, options);
  const data = await response1.json();
  if (data.data) {
    var bermad_program_id = data.data.createOneProgram.id;
    var program_index = data.data.createOneProgram.index;
    // return response.success(res, "Record Created", data.data);
    exports.graphqlMasterCreateUpdate(
      req,
      res,
      "programs",
      bermad_program_id,
      program_index
    );
    //exports.graphqlMasterCreateUpdate(req, res, "programs_amount");
  } else {
    var singleErrorDetailPayloadData = {
      error_code: 0,
      payload: JSON.stringify(graphqlQuery.variables),
      error_msg: data.errors[0].message,
    };
    // console.log("singleErrorDetailPayloadData", singleErrorDetailPayloadData);
    Model.error_log
      .create(singleErrorDetailPayloadData)
      .then((result) => {
        return response.success(res, "Error logged in Database", data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

exports.updateOneProgram = async (req, res) => {
  const endpoint = config.graphql_endpoint;
  const headers = {
    "content-type": "application/json",
    Authorization: config.graphql_authorization,
  };
  const graphqlQuery = {
    operationName: "programUpdate",
    query: `mutation programUpdate($id: String!, $name: NullableStringFieldUpdateOperationsInput, $description: NullableStringFieldUpdateOperationsInput, $cycleTypeIsCyclic: NullableBoolFieldUpdateOperationsInput, $hourlyEnd: NullableIntFieldUpdateOperationsInput, $cyclePerDay: NullableIntFieldUpdateOperationsInput, $endTimeMode: NullableBoolFieldUpdateOperationsInput, $hourlyStart: NullableIntFieldUpdateOperationsInput, $cycleTypeHours: ProgramUpdatecycleTypeHoursInput, $allowedHoursEnd: NullableIntFieldUpdateOperationsInput, $measurementType: NullableEnumMeasurement_TypeFieldUpdateOperationsInput, $allowedHoursStart: NullableIntFieldUpdateOperationsInput, $cycleDayStartHour: NullableIntFieldUpdateOperationsInput, $cycleIntervalDays: NullableIntFieldUpdateOperationsInput, $cycleIntervalHours: NullableIntFieldUpdateOperationsInput, $irrigationDays: NullableIntFieldUpdateOperationsInput, $startDate: NullableDateTimeFieldUpdateOperationsInput, $programAmount: ProgramAmountUpdateManyWithoutProgramInput, $type: EnumProgramTypeFieldUpdateOperationsInput, $status: NullableEnumProgramStatusFieldUpdateOperationsInput) {
      updateOneProgram(
        data: {name: $name, description: $description, cycleTypeIsCyclic: $cycleTypeIsCyclic, hourlyEnd: $hourlyEnd, cyclePerDay: $cyclePerDay, endTimeMode: $endTimeMode, hourlyStart: $hourlyStart, cycleTypeHours: $cycleTypeHours, allowedHoursEnd: $allowedHoursEnd, measurementType: $measurementType, allowedHoursStart: $allowedHoursStart, cycleDayStartHour: $cycleDayStartHour, cycleIntervalDays: $cycleIntervalDays, cycleIntervalHours: $cycleIntervalHours, irrigationDays: $irrigationDays, startDate: $startDate, programAmount: $programAmount, type: $type, status: $status}
        where: {id: $id}
      ) {
        id
        __typename
        name
        type
        description
        status
        cycleTypeIsCyclic
        hourlyEnd
        cyclePerDay
        endTimeMode
        hourlyStart
        cycleTypeHours
        allowedHoursEnd
        measurementType
        allowedHoursStart
        cycleDayStartHour
        cycleIntervalDays
        cycleIntervalHours
        irrigationDays
        startDate
        programAmount {
          id
          amount
          order
          fert1WaterBefore
          fert1Amount
          fert1WaterAfter
          fert2WaterBefore
          fert2Amount
          fert2WaterAfter
          valve {
            id
            name
            __typename
          }
          valveId
          programId
          __typename
        }
      }
    }
      `,

    variables: {
      // id: req.body.id,
      id: req.body.data.omega_id,
      allowedHoursStart: {
        set: req.body.data.allowedHoursStart,
      },
      allowedHoursEnd: {
        set: req.body.data.allowedHoursEnd,
      },
      measurementType: {
        set: req.body.data.measurementType,
      },
      startDate: {
        set: req.body.data.startDate,
      },
      cycleIntervalDays: {
        set: req.body.data.cycleIntervalDays,
      },
      irrigationDays: {
        set: req.body.data.irrigationDays,
      },
      cycleDayStartHour: {
        set: req.body.data.cycleDayStartHour,
      },
      cyclePerDay: {
        set: req.body.data.cyclePerDay,
      },
      hourlyStart: {
        set: req.body.data.hourlyStart,
      },
      cycleTypeHours: {
        set: req.body.data.cycleTypeHours,
      },
      hourlyEnd: {
        set: req.body.data.hourlyEnd,
      },
      endTimeMode: {
        set: req.body.data.endTimeMode,
      },
      cycleIntervalHours: {
        set: req.body.data.cycleIntervalHours,
      },
      cycleTypeIsCyclic: {
        set: req.body.data.cycleTypeIsCyclic,
      },
      programAmount: {
        create: [
          {
            amount: req.body.data.amount,
            order: req.body.data.order,
            fert1Amount: req.body.data.fert1Amount,
            fert1WaterAfter: req.body.data.fert1WaterAfter,
            fert1WaterBefore: req.body.data.fert1WaterBefore,
            fert2Amount: req.body.data.fert2Amount,
            fert2WaterAfter: req.body.data.fert2WaterAfter,
            fert2WaterBefore: req.body.data.fert2WaterBefore,
            fert1ValveIndex: req.body.data.fert1ValveIndex,
            fert2ValveIndex: req.body.data.fert2ValveIndex,
            valve: {
              connect: {
                id: req.body.data.valveId,
              },
            },
          },
        ],
      },
      name: {
        // set: req.body.data.name,
        set: req.body.data.program_name,
      },
      description: {
        set: req.body.data.description,
      },
      status: {
        set: req.body.data.status,
      },
      type: {
        set: req.body.data.type,
      },
    },
  };

  const options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(graphqlQuery),
  };
  const response1 = await fetch(endpoint, options);
  const data = await response1.json();
  if (data.data) {
    // console.log("success",data.data)
    // return response.success(res, "Record Updated", data.data);
    // exports.masterCreateUpdate(req, res);
    exports.graphqlMasterCreateUpdate(req, res, "programs");
    //  exports.graphqlMasterCreateUpdate(req, res, "programs_amount");
  } else {
    var singleErrorDetailPayloadData = {
      error_code: 0,
      payload: JSON.stringify(graphqlQuery.variables),
      error_msg: data.errors[0].message,
    };

    // console.log("singleErrorDetailPayloadData", singleErrorDetailPayloadData);

    Model.error_log
      .create(singleErrorDetailPayloadData)
      .then((result) => {
        return response.success(
          res,
          "Something went wrong while creating the program.",
          data
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }
};
exports.downloadProgram = async (req, res) => {
  var project_id = req.params.project_id;
  Model.sequelize
    .query(`select * from city_masters`, {
      type: Model.sequelize.QueryTypes.SELECT,
    })
    .then((cityList) => {
      // const id = req.body.id;
      // const module = req.body.module;
      var headerContent = [
        { header: "state_id", key: "state_id", width: 25 },
        { header: "city_name", key: "city", width: 25 },
        {
          header: "active",
          key: "active",
          width: 10,
        },
        { header: "created At", key: "createdAt", width: 10 },
        { header: "Updated At", key: "updatedAt", width: 10 },
      ];

      console.log("header", headerContent);
      // return false;
      var fileName = "ProgramList";
      commonfunction.download(
        cityList,
        headerContent,
        res,
        fileName,
        function (datares) {
          //fs.writeFileSync(fileName, decodeData, "base64", function (err) {});
        }
      );
    });
};

exports.updateProgramstatus = async (req, res) => {
  const endpoint = config.graphql_endpoint;
  const headers = {
    "content-type": "application/json",
    Authorization: config.graphql_authorization,
  };
  const graphqlQuery = {
    operationName: "programStatus",
    query: `mutation programStatus($programId: String!, $status: ProgramStatus, $name: String, $description: String) 
    { programStatus(programId: $programId, status:$status , name: $name, description:$description )
       {    id    status    name    description    __typename }
    }`,
    variables: {
      // programId: req.body.id,
      // status: req.body.status,
      programId: req.body.data.Omega_id,
      status: req.body.data.status,
    },
  };

  const options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(graphqlQuery),
  };
  const response1 = await fetch(endpoint, options);
  const data = await response1.json();
  if (data.data) {
    // console.log("success")
    // return response.success(res, "Record Updated", data.data);
    exports.graphqlMasterCreateUpdate(req, res, "programs");
  } else {
    var singleErrorDetailPayloadData = {
      error_code: 0,
      payload: JSON.stringify(graphqlQuery.variables),
      error_msg: data.errors[0].message,
    };

    // console.log("singleErrorDetailPayloadData", singleErrorDetailPayloadData);

    Model.error_log
      .create(singleErrorDetailPayloadData)
      .then((result) => {
        return response.success(res, "Error logged in Database", data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

exports.deleteProgram = async (req, res) => {
  const endpoint = config.graphql_endpoint;
  const headers = {
    "content-type": "application/json",
    Authorization: config.graphql_authorization,
  };
  const graphqlQuery = {
    operationName: "programUpdate",
    query: `mutation programUpdate($id: String!, $name: NullableStringFieldUpdateOperationsInput, $description: NullableStringFieldUpdateOperationsInput, $cycleTypeIsCyclic: NullableBoolFieldUpdateOperationsInput, $hourlyEnd: NullableIntFieldUpdateOperationsInput, $cyclePerDay: NullableIntFieldUpdateOperationsInput, $endTimeMode: NullableBoolFieldUpdateOperationsInput, $hourlyStart: NullableIntFieldUpdateOperationsInput, $cycleTypeHours: ProgramUpdatecycleTypeHoursInput, $allowedHoursEnd: NullableIntFieldUpdateOperationsInput, $measurementType: NullableEnumMeasurement_TypeFieldUpdateOperationsInput, $allowedHoursStart: NullableIntFieldUpdateOperationsInput, $cycleDayStartHour: NullableIntFieldUpdateOperationsInput, $cycleIntervalDays: NullableIntFieldUpdateOperationsInput, $cycleIntervalHours: NullableIntFieldUpdateOperationsInput, $irrigationDays: NullableIntFieldUpdateOperationsInput, $startDate: NullableDateTimeFieldUpdateOperationsInput, $programAmount: ProgramAmountUpdateManyWithoutProgramInput, $type: EnumProgramTypeFieldUpdateOperationsInput, $status: NullableEnumProgramStatusFieldUpdateOperationsInput) {
      updateOneProgram(
        data: {name: $name, description: $description, cycleTypeIsCyclic: $cycleTypeIsCyclic, hourlyEnd: $hourlyEnd, cyclePerDay: $cyclePerDay, endTimeMode: $endTimeMode, hourlyStart: $hourlyStart, cycleTypeHours: $cycleTypeHours, allowedHoursEnd: $allowedHoursEnd, measurementType: $measurementType, allowedHoursStart: $allowedHoursStart, cycleDayStartHour: $cycleDayStartHour, cycleIntervalDays: $cycleIntervalDays, cycleIntervalHours: $cycleIntervalHours, irrigationDays: $irrigationDays, startDate: $startDate, programAmount: $programAmount, type: $type, status: $status}
        where: {id: $id}
      ) {
        id
        __typename
        name
        type
        description
        status
        cycleTypeIsCyclic
        hourlyEnd
        cyclePerDay
        endTimeMode
        hourlyStart
        cycleTypeHours
        allowedHoursEnd
        measurementType
        allowedHoursStart
        cycleDayStartHour
        cycleIntervalDays
        cycleIntervalHours
        irrigationDays
        startDate
        programAmount {
          id
          amount
          order
          fert1WaterBefore
          fert1Amount
          fert1WaterAfter
          fert2WaterBefore
          fert2Amount
          fert2WaterAfter
          valve {
            id
            name
            __typename
          }
          valveId
          programId
          __typename
        }
      }
    }
    `,
    variables: {
      id: req.body.data.Omega_id,
      status: {
        set: req.body.data.status, //DELETED
      },
    },
  };

  const options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(graphqlQuery),
  };
  const response1 = await fetch(endpoint, options);
  const data = await response1.json();
  if (data.data) {
    // console.log("success",data.data)

    // return response.success(res, "Record Updated", data.data);
    exports.graphqlMasterCreateUpdate(req, res, "programs");
  } else {
    var singleErrorDetailPayloadData = {
      error_code: 0,
      payload: JSON.stringify(graphqlQuery.variables),
      error_msg: data.errors[0].message,
    };

    // console.log("singleErrorDetailPayloadData", singleErrorDetailPayloadData);

    Model.error_log
      .create(singleErrorDetailPayloadData)
      .then((result) => {
        return response.success(
          res,
          "Something went wrong while updating the program.",
          data
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

exports.importCompleteFile = async (req, res) => {
  var filePath = "./uploads/importFile/"; //  req.file.filename =
  var fileName = req.file.filename; //"1111111.xlsx";

  commonfunction.importFileFunctionReturnAll(
    filePath,
    fileName,
    function (importFileResponse) {
      if (importFileResponse.code == 1) {
        console.log("importFileResponse.rows", importFileResponse.rows);
        importFileResponse.rows.forEach((element) => {
          var singleData = {
            srno: element[0],
            name: element[1],
            remark: element[2],
          };

          Model.sampleLog
            .create(singleData)
            .then((result) => {
              //
            })
            .catch((err) => {
              console.log(err);
            });
          // return response.success("","data logged in Database");
        });
        return response.success(
          res,
          importFileResponse.status,
          importFileResponse.rows
        );
      } else {
        return response.fail(res, importFileResponse.status, "");
      }
    }
  );
};
// , socketData, socketIO
exports.getUnitStatus = async (req, res, socketData, socketIO) => {
  const endpoint = config.graphql_endpoint;
  const socketDeviceId = socketData.device_id;
  const socketProjectId = socketData.project_id;
  if (!socketData) {
    console.log("socket data is required");
    return;
  }
  if (!socketDeviceId) {
    console.log("socket Device is required");
    return;
  }
  if (!socketProjectId) {
    console.log("socket Project is required");
    return;
  }
  // const socketDeviceId = "clahuvov851900yu4aikt9sxv";
  // const socketProjectId = 1;
  const headers = {
    "content-type": "application/json",
    Authorization: config.graphql_authorization,
  };
  const graphqlQuery = {
    operationName: "getUnitStatus",
    query: `query getUnitStatus($id: String!){
      unitStatus(id:$id){
        isOnline
        digitals
        valves {
        index status
        state
        error
        }watermeters {
        index
        flow status
        error
        totalizer
        }
        programs {
        index
        type
        cyc_left
        valve
        flow state
        leftover
        }
        analogs {
        index value
        status
        error
        }
      }
      }
    `,
    variables: {
      id: socketDeviceId,
    },
  };

  const options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(graphqlQuery),
  };
  const response1 = await fetch(endpoint, options);
  const data = await response1.json();
  if (data.data) {
    var responseData = data.data;
    responseData["omega_id"] = socketDeviceId;
    // insert live monitoring table
    exports.insertLiveMonitoringFunction(
      socketProjectId,
      socketDeviceId,
      responseData.omega_id,
      responseData.unitStatus,
      function (liveMonitroringInsertUpdateResponse) {
        Model.live_monitoring
          .findAll({
            where: { omega_id: responseData.omega_id },
          })
          .then((liveMonitoringResponse) => {
            var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(liveMonitoringResponse), 'secret key 123').toString();
            socketIO.to(socketData.socketID).emit("receive_message", ciphertext);
            // return response.success(res, "data", liveMonitoringResponse);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    );
  } else {
    var singleErrorDetailPayloadData = {
      error_code: 0,
      payload: JSON.stringify(graphqlQuery.variables),
      error_msg: data.errors[0].message,
    };

    // console.log("singleErrorDetailPayloadData", singleErrorDetailPayloadData);
    Model.error_log
      .create(singleErrorDetailPayloadData)
      .then((result) => {
        return response.success(res, "Error logged in Database", data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

exports.insertLiveMonitoringFunction = (
  project_id,
  device_id,
  omega_id,
  responseData,
  callback
) => {
  // var singleItemData = responseData;
  const stringifyData = JSON.stringify(responseData);
  const singleItemData = JSON.parse(stringifyData);

  Model.live_monitoring
    .findAll({
      where: { omega_id: omega_id },
    })
    .then((isInsertOrUpdate) => {
      if (isInsertOrUpdate.length > 0) {
        var id = isInsertOrUpdate[0].id;
        // update data
        const liveMonitering = {
          project_id: project_id,
          omega_id: omega_id,
          device_id: device_id,
          isonline: singleItemData.isOnline,
          digital_inputs: singleItemData.digitals,
          valves: singleItemData.valves,
          watermeter: singleItemData.watermeters,
          programs: singleItemData.programs,
          analogs: singleItemData.analogs,
        };
        Model.live_monitoring
          .update(liveMonitering, {
            where: { id: id },
          })
          .then((result) => {
            Model.live_monitoring
              .findAll({
                where: {
                  omega_id: omega_id,
                },
              })
              .then((liveMonitoringUpdateResponse) => {
                callback(liveMonitoringUpdateResponse);
              })
              .catch((err) => {
                console.log(err);
              });
          });
      } else {
        // insert data
        const liveMonitering = {
          project_id: project_id,
          omega_id: omega_id,
          device_id: device_id,
          isonline: singleItemData.isOnline,
          digital_inputs: singleItemData.digitals,
          valves: singleItemData.valves,
          watermeter: singleItemData.watermeters,
          programs: singleItemData.programs,
          analogs: singleItemData.analogs,
        };

        Model.live_monitoring
          .create(liveMonitering)
          .then((liveMonitoringInsertResponse) => {
            callback(liveMonitoringInsertResponse);
          });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

// Get unique Omega list
exports.getUniqueOmegaIds = async (req, res) => {
  const project_id = req.body.project_id;
  Model.sequelize
    .query(
      `select id,omega_id, device_name, lat, long from devices_masters 
      where project_id=${project_id} and active=1
      and id NOT IN (select device_id from project_devices where project_id='${project_id}')
      and id NOT IN(select device_id from zone_devices where project_id='${project_id}')
      and id NOT IN (select device_id from sub_zone_devices where project_id='${project_id}')
      and id NOT IN (select device_id from device_profile_details where project_id='${project_id}')`,
      {
        type: Model.sequelize.QueryTypes.SELECT,
      }
    )
    .then(function (OmegaData) {
      if (OmegaData.length > 0) {
        //////////////////////////////
        return response.success(res, "Unique Omega Data", OmegaData);
      } else {
        return response.fail(res, "No Records Found");
      }
    });
};

exports.startProgram = async (req, res) => {
  const endpoint = config.graphql_endpoint;
  const variables = {
    id: req.body.omega_id,
    index: req.body.index,
  };
  const operationName = "startProgram";
  const query = `mutation startProgram($id: String!, $index: Int!) {  startProgram(id: $id, index: $index) }`;

  commonfunction.programGraphql(
    endpoint,
    operationName,
    query,
    variables,
    function (programGraphqlResponse) {
      if (programGraphqlResponse != 0) {
        commonfunction.programStatusUpdate(
          req.body.bermad_program_id,
          1,
          function (programStatusUpdateResponse) {
            return response.success(
              res,
              "Program Started",
              programGraphqlResponse
            );
          }
        );
      } else {
        return response.success(res, "Error logged in Database", data);
      }
    }
  );
};

exports.startCycle = async (req, res) => {
  const endpoint = config.graphql_endpoint;
  const headers = {
    "content-type": "application/json",
    Authorization: config.graphql_authorization,
  };
  const graphqlQuery = {
    operationName: "startCycle",
    query: `mutation startCycle($id: String!, $index: Int!) {  startCycle(id: $id, index: $index) } `,
    variables: {
      // programId: req.body.id,
      // status: req.body.status,
      id: req.body.data.bermad_program_id,
      index: req.body.data.index,
    },
  };

  const options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(graphqlQuery),
  };
  const response1 = await fetch(endpoint, options);
  const data = await response1.json();
  if (data.data) {
    console.log(data.data);
    return response.success(res, "Program cycle Started", data.data);
    // exports.graphqlMasterCreateUpdate(req, res, "programs");
  } else {
    var singleErrorDetailPayloadData = {
      error_code: 0,
      payload: JSON.stringify(graphqlQuery.variables),
      error_msg: data.errors[0].message,
    };

    // console.log("singleErrorDetailPayloadData", singleErrorDetailPayloadData);

    Model.error_log
      .create(singleErrorDetailPayloadData)
      .then((result) => {
        return response.success(res, "Error logged in Database", data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

exports.getProjectDataByUserId = async (req, res) => {
  const user_id = req.body.user_id;
  const project_type_id = req.body.project_type_id;
  Model.sequelize
    .query(
      `select pr.*
        from projects pr
        left join project_access_managements pma on pma.project_id = pr.id and pma.access=1
        where pma.user_id =  ${user_id} and pr.project_type_id =  ${project_type_id} `,
      {
        type: Model.sequelize.QueryTypes.SELECT,
      }
    )
    .then(function (projectData) {
      if (projectData.length > 0) {
        return response.success(res, "Project Data", projectData);
      } else {
        return response.fail(res, "Project Data Not Found");
      }
    });
};

exports.stopProgram = async (req, res) => {
  const endpoint = config.graphql_endpoint;
  const variables = {
    id: req.body.omega_id,
    omega_id: req.body.omega_id,
  };
  const operationName = "stopProgram";
  const query = `mutation stopProgram($id: String!, $index: Int!) { stopProgram(id: $id, index: $index)}`;
  commonfunction.programGraphql(
    endpoint,
    operationName,
    query,
    variables,
    function (programGraphqlResponse) {
      commonfunction.programStatusUpdate(
        req.body.bermad_program_id,
        0,
        function (programStatusUpdateResponse) {
          return response.success(res, "Program Stop", programGraphqlResponse);
        }
      );
    }
  );
};

exports.pauseProgram = async (req, res) => {
  const endpoint = config.graphql_endpoint;
  const variables = {
    id: req.body.omega_id,
    index: req.body.index,
  };
  const operationName = "pauseProgram";
  const query = `mutation pauseProgram($id: String!, $index: Int!) { pauseProgram(id: $id, index: $index)}`;
  commonfunction.programGraphql(
    endpoint,
    operationName,
    query,
    variables,
    function (programGraphqlResponse) {
      if (programGraphqlResponse != 0) {
        commonfunction.programStatusUpdate(
          req.body.bermad_program_id,
          2,
          function (programStatusUpdateResponse) {
            return response.success(
              res,
              "Program Paused",
              programGraphqlResponse
            );
          }
        );
      } else {
        return response.success(res, "Error logged in Database", "");
      }
    }
  );
};

exports.getUnit = async (req, res) => {
  const endpoint = config.graphql_endpoint;
  const headers = {
    "content-type": "application/json",
    Authorization: config.graphql_authorization,
  };
  const graphqlQuery = {
    operationName: "getUnit",
    query: `query getUnit($id: String!) {
      unit(where: {id: $id}) {
        realTime {
          id
          isOnline
          config_sync
          errors
          next_irrigation
          next_irrigation_index
          valves {
            index
            status
            state
            error
            __typename
          }
          watermeters {
            index
            flow
            status
            error
            totalizer
            __typename
          }
          fertilizers {
            index
            flow
            seconds_left
            perc
            state
            error
            valve_index
            __typename
          }
          analogs {
            index
            value
            status
            error
            __typename
          }
          digitals
          programs {
            index
            type
            state
            valve
            flow
            leftover
            perc
            next_vlv
            cyc_left
            __typename
          }
          __typename
        }
        id
        modelAtCreation
        allowModbus
        isLowPower
        created
        updated
        disableDays
        exceptionDates
        wakeUpTimes
        timezone
        blePassword
        name
        description
        status
        lat
        model
        batteryCriticalLowFailureReact
        batteryLowFailureReact
        budgetStart
        budgetEnd
        masterId
        budget
        logInterval
        analogInterval
        powerInterval
        batteryLowVoltage
        batteryCriticalVoltage
        defaultNetworkProvider
        logIntervalValve
        logIntervalWatermeter
        factorAmountPrec
        project {
          id
          units(orderBy: {order: asc}) {
            id
            name
            __typename
          }
          __typename
        }
        physical {
          model
          serial
          firmwareId
          isOnline
          lastConnection
          syncUnit
          syncValve
          syncWatermeter
          syncProgram
          syncAnalog
          simNumber
          __typename
        }
        owner {
          firstName
          lastName
          id
          timezone
          __typename
        }
        master {
          id
          __typename
        }
        masterId
        long
        startDate
        stopDate
        startHour
        stopHour
        masterValveOpenOrder
        masterValveCloseOrder
        openDelay
        closeDelay
        parallelTime
        allowParallel
        entityCount
        valves(orderBy: {order: asc}, where: {status: {notIn: DELETED}}) {
          id
          index
          name
          description
          flow
          color
          icon
          updated
          status
          fillDelay
          lowFlow
          highFlow
          flowAlertDelay
          unitId
          waterMeterId
          lowFlowReact
          highFlowReact
          noPulseReact
          fertigationType
          outputNum
          budget
          isPump
          fertIndex
          waterMeter {
            id
            name
            pulseSize
            index
            __typename
          }
          __typename
        }
        analogInputs(orderBy: {index: asc}, where: {status: {notIn: DELETED}}) {
          id
          created
          updated
          name
          description
          analogNum
          engValueMax
          engValueMin
          timeDelay
          lowSetPoint
          highSetPoint
          status
          type
          reactOnLowCase
          reactOnHighCase
          unitOfMeasure
          index
          histeresis
          warmUpTime
          logInterval
          samplingRate
          __typename
        }
        waterMeters(orderBy: {index: asc}, where: {status: {notIn: DELETED}}) {
          id
          created
          updated
          status
          name
          description
          pulseSize
          pulseLength
          noWaterPulseDelay
          numPulsesIsLeakage
          leakReact
          inputNum
          totalAmount
          index
          slaveId
          baudRate
          readInterval
          volumeRegister
          volUnits
          flowRegister
          flowUnits
          byteOrder
          commandRegister
          __typename
        }
        programs(orderBy: {order: asc}, where: {status: {notIn: DELETED}}) {
          id
          last
          name
          description
          updated
          status
          cycleTypeIsCyclic
          hourlyStart
          cycleIntervalHours
          irrigationDays
          cycleTypeHours
          startDate
          cycleIntervalDays
          cyclePerDay
          type
          index
          allowedHoursStart
          allowedHoursEnd
          measurementType
          programAmount {
            id
            programId
            valveId
            amount
            order
            fert1Amount
            fert1WaterBefore
            fert1WaterAfter
            fert2Amount
            fert2WaterBefore
            fert2WaterAfter
            program {
              id
              name
              __typename
            }
            valve {
              id
              name
              __typename
            }
            __typename
          }
          __typename
        }
        __typename
      }
    }
    `,
    variables: {
      id: req.body.id,
    },
  };

  const options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(graphqlQuery),
  };
  const response1 = await fetch(endpoint, options);
  const data = await response1.json();
  if (data.data) {
    return response.success(res, "success", data.data);
  } else {
    var singleErrorDetailPayloadData = {
      error_code: 0,
      payload: JSON.stringify(graphqlQuery.variables),
      error_msg: data.errors[0].message,
    };
    Model.error_log
      .create(singleErrorDetailPayloadData)
      .then((result) => {
        return response.success(res, "Error logged in Database", data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

exports.programDownload = async (req, res) => {
  const program_id = req.body.program_id;
  Model.sequelize
    .query(`select `, {
      type: Model.sequelize.QueryTypes.SELECT,
    })
    .then(function (ProjectWiseAccessData) {
      if (ProjectWiseAccessData.length > 0) {
        //////////////////////////////
        return response.success(
          res,
          "Project Access Data",
          ProjectWiseAccessData
        );
      } else {
        return response.fail(res, "Not Found", "");
      }
    });
};

exports.getLogsSystem = async (req, res) => {
  var from_date = req.body.from_date;
  var to_date = req.body.to_date;
  var project_id = req.body.project_id;
  var unit_id = req.body.unit_id;
  var alert_type = req.body.alert_type;
  if (!from_date) {
    return response.fail(res, "From Data Required");
  }
  if (!to_date) {
    return response.fail(res, "From Data Required");
  }
  if (!project_id) {
    return response.fail(res, "From Data Required");
  }
  var unitIdSql = "";
  if (unit_id != undefined) {
    unitIdSql = ` AND unit_id = '${unit_id}'`;
  }
  var alertTypeSql = "";
  if (alert_type != undefined) {
    alertTypeSql = ` AND line = '${alert_type}'`;
  }

  var sql = `SELECT * FROM system_logs 
  WHERE project_id = '${project_id}' 
  AND datetimelocal BETWEEN '${from_date}' AND '${to_date}' 
  ${unitIdSql} ${alertTypeSql}`;
  Model.sequelize
    .query(sql, {
      type: Model.sequelize.QueryTypes.SELECT,
    })
    .then(function (systemLogResposne) {
      if (systemLogResposne.length > 0) {
        return response.success(res, "System Log Data", systemLogResposne);
      } else {
        return response.fail(res, "No Records Found");
      }
    });
};

exports.getOmegaMasterlist = async (req, res) => {
  const project_id = req.body.project_id;
  var sql = `select DISTINCT ON (dm.id) dm.id, dm.omega_id, dm.device_name, dm.active,
        zd.zone_id, szd.sub_zone_id, pd.project_id, dpd.device_profile_id,
        (CASE WHEN zd.id IS NOT null THEN 1
        WHEN szd.id IS NOT null THEN 2
        WHEN dpd.id IS NOT null THEN 3
        WHEN pd.id IS NOT null THEN 4
        ELSE 0 END) as number
        from devices_masters as dm
        left join zone_devices as zd on zd.device_id = dm.id
        left join sub_zone_devices as szd on szd.device_id = dm.id
        left join device_profile_details as dpd on dpd.device_id = dm.id
        left join project_devices as pd on pd.device_id = dm.id
        where dm.project_id = '${project_id}'`
  // group by dm.id, zd.zone_id, szd.sub_zone_id, pd.project_id, dpd.device_profile_id, zd.id, szd.id, dpd.id, pd.id
  Model.sequelize.query(sql, {
    type: Model.sequelize.QueryTypes.SELECT,
  }).then(async function (OmegaData) {
    if (OmegaData.length > 0) {
      var temp = []
      // callback function
      exports.functionName(0, temp, OmegaData, function (responseData) {
        return response.success(res, "Omega Listing Data", responseData);
      });
    } else {
      return response.fail(res, "No Records Found");
    }

  });
};
exports.functionName = async (index, temp, OmegaData, callback) => {
  const stringifyData = JSON.stringify(OmegaData);
  const parseData = JSON.parse(stringifyData);
  var dataLength = parseData.length;
  if (parseFloat(dataLength) === 0) {
    callback(1);
    return;
  }
  var singleItemData = parseData[index];

  ////
  var number = singleItemData.number
  if (number == 1) { // zone_master data
    var responseData = await Model.zone_master.findAll({ attributes: ["zone_name"], where: { id: singleItemData.zone_id }, });
    if (responseData.length > 0) {
      singleItemData.assigned = responseData[0].zone_name
    }
  } else if (number == 2) { // sub_zone_master data
    var responseData = await Model.sub_zone_master.findAll({ attributes: ["sub_zone_name"], where: { id: singleItemData.sub_zone_id }, });
    if (responseData.length > 0) {
      singleItemData.assigned = responseData[0].sub_zone_name
    }
  } else if (number == 3) { // device_profile data
    var responseData = await Model.device_profile.findAll({ attributes: ["device_name"], where: { id: singleItemData.device_profile_id }, });
    if (responseData.length > 0) {
      singleItemData.assigned = responseData[0].device_name
    }
  } else if (number == 4) { // project data
    var responseData = await Model.project.findAll({ attributes: ["project_name"], where: { id: singleItemData.project_id }, });
    if (responseData.length > 0) {
      singleItemData.assigned = responseData[0].project_name
    }
  }
  temp.push(singleItemData)
  ////

  //// increment  
  index = parseInt(index) + 1;
  if (parseFloat(index) < parseFloat(dataLength)) {
    exports.functionName(index, temp, OmegaData, callback);
  } else {
    callback(temp);
  }
}

exports.getFarmerProfilelist = async (req, res) => {
  Model.sequelize
    .query(
      `select ROW_NUMBER() OVER (ORDER BY fm.id desc) as index,fm.id, fm.farmer_id, fm.farmer_name, fm.mobile_number, 
      fm.email_id, fm.address, sum(fd.water_demand) as water_demand, sum(fd.cultivated_area) as cultivated_area, 
      count(fd.field_id) as field_id_count, fm.active
      from farmer_masters fm 
      left join farmer_details fd ON fm.id=fd.farmer_id group by fm.id order by fm.id desc`,
      {
        type: Model.sequelize.QueryTypes.SELECT,
      }
    )
    .then(function (FarmerData) {
      if (FarmerData.length > 0) {
        return response.success(res, "Farmer Listing Data", FarmerData);
      } else {
        return response.fail(res, "No Records Found");
      }
    });
};

exports.excelExport = async (req, res) => {
  console.log("hello");
  if (!req.body.project_id) {
    return response.fail(res, "Project Id is Required", "");
  }
  var project_id = req.body.project_id;
  Model.programs
    .findAll({
      where: {
        project_id: project_id,
      },
    })
    .then((programMasterResponse) => {
      if (programMasterResponse.length > 0) {
        Model.programs_amount
          .findAll({
            where: {
              id: program_id,
            },
          })
          .then((programAmountMasterResponse) => { })
          .catch((err) => {
            console.log(err);
          });
        var temp = [];
        programMasterResponse.forEach((element) => {
          temp.push({
            omega_id: element.omega_id,
            program_index: element.program_index,
            cycleTypeHours: element.cycleTypeHours,
            cycleTypeHours: element.cycleTypeHours,
          });
        });

        return response.success(
          res,
          "Device Master Response",
          deviceMasterResponse
        );
      } else {
        return response.fail(res, "No Data Found!", "");
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

// resume program api
exports.resumeProgram = async (req, res) => {
  const endpoint = config.graphql_endpoint;
  const variables = {
    id: req.body.omega_id,
    index: req.body.index,
  };
  const operationName = "resumeProgram";
  const query = `mutation resumeProgram($id: String!, $index: Int!) {  resumeProgram(id: $id, index: $index)}`;
  commonfunction.programGraphql(
    endpoint,
    operationName,
    query,
    variables,
    function (programGraphqlResponse) {
      if (programGraphqlResponse != 0) {
        commonfunction.programStatusUpdate(
          req.body.bermad_program_id,
          3,
          function (programStatusUpdateResponse) {
            return response.success(
              res,
              "Program Resume",
              programGraphqlResponse
            );
          }
        );
      } else {
        return response.success(res, "Error logged in Database", "");
      }
    }
  );
};

exports.liveMonitoring = async (req, res) => {
  // console.log("hello");
  var whereCondition = "";
  var project_id = 0;
  //console.log("req--", req);
  //return false;
  /* if (Object.getOwnPropertyNames(req.body).length === 0) {
    if (req.body.project_id != undefined) {
      project_id = req.body.project_id;
      whereCondition = `where project_id = ${req.body.project_id}`;
    }
  }*/

  Model.sequelize
    .query(
      `select * from devices_masters ${whereCondition} order by project_id`,
      {
        type: Model.sequelize.QueryTypes.SELECT,
      }
    )
    .then((deviceMasterResponse) => {
      if (deviceMasterResponse.length > 0) {
        var index = 0;
        exports.insertUpdateLiveMonitoringFunction(
          index,
          project_id,
          deviceMasterResponse,
          function (liveMonitroringInsertUpdateResponse) {
            if (req != undefined) {
              return response.success(
                res,
                "Live Monitoring Insert Successfully",
                ""
              );
            }
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
exports.insertUpdateLiveMonitoringFunction = async (
  index,
  project_id,
  responseData,
  callback
) => {
  // var singleItemData = responseData;
  const stringifyData = JSON.stringify(responseData);
  const parseData = JSON.parse(stringifyData);
  var dataLength = parseData.length;
  if (parseFloat(dataLength) === 0) {
    callback(1);
    return;
  }
  var singleItemData = parseData[index];

  // graphql
  const endpoint = config.graphql_endpoint;
  const headers = {
    "content-type": "application/json",
    Authorization: config.graphql_authorization,
  };
  const graphqlQuery = {
    operationName: "getUnitStatus",
    query: `query getUnitStatus($id: String!){
      unitStatus(id:$id){
        isOnline
        digitals
        valves {
        index status
        state
        error
        }watermeters {
        index
        flow status
        error
        totalizer
        }
        programs {
        index
        type
        cyc_left
        valve
        flow state
        leftover
        }
        analogs {
        index value
        status
        error
        }
      }
      }
    `,
    variables: {
      id: singleItemData.omega_id,
    },
  };

  const options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(graphqlQuery),
  };
  const response1 = await fetch(endpoint, options);
  const data = await response1.json();
  /////////////
  console.log("unitStatus", data.data.unitStatus);
  //return false;
  if (data.data.unitStatus) {
    var graphqlReponseData = data.data.unitStatus;
    console.log("graphqlReponseData", graphqlReponseData);
    console.log("singleItemData.omega_id", singleItemData.omega_id);
    // return false;
    /////
    Model.live_monitoring
      .findAll({
        where: { omega_id: singleItemData.omega_id },
      })
      .then((isInsertOrUpdate) => {
        if (isInsertOrUpdate.length > 0) {
          var id = isInsertOrUpdate[0].id;
          // update data
          const liveMonitering = {
            project_id: singleItemData.project_id,
            omega_id: singleItemData.omega_id,
            device_id: singleItemData.id,
            isonline: graphqlReponseData.isOnline,
            digital_inputs: graphqlReponseData.digitals,
            valves: graphqlReponseData.valves,
            watermeter: graphqlReponseData.watermeters,
            programs: graphqlReponseData.programs,
            analogs: graphqlReponseData.analogs,
          };
          Model.live_monitoring
            .update(liveMonitering, {
              where: { id: id },
            })
            .then((result) => {
              Model.live_monitoring
                .findAll({
                  where: {
                    omega_id: singleItemData.omega_id,
                  },
                })
                .then((liveMonitoringUpdateResponse) => {
                  index = parseInt(index) + 1;
                  if (parseFloat(index) < parseFloat(dataLength)) {
                    exports.insertUpdateLiveMonitoringFunction(
                      index,
                      project_id,
                      responseData,
                      callback
                    );
                  } else {
                    callback(1);
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            });
        } else {
          if (graphqlReponseData) {
            // insert data
            const liveMonitering = {
              project_id: singleItemData.project_id,
              omega_id: singleItemData.omega_id,
              device_id: singleItemData.id,
              //  isonline: graphqlReponseData.isOnline,
              digital_inputs: graphqlReponseData.digitals,
              valves: graphqlReponseData.valves,
              watermeter: graphqlReponseData.watermeters,
              programs: graphqlReponseData.programs,
              analogs: graphqlReponseData.analogs,
            };

            Model.live_monitoring
              .create(liveMonitering)
              .then((liveMonitoringInsertResponse) => {
                index = parseInt(index) + 1;
                if (parseFloat(index) < parseFloat(dataLength)) {
                  exports.insertUpdateLiveMonitoringFunction(
                    index,
                    project_id,
                    responseData,
                    callback
                  );
                } else {
                  callback(1);
                }
              });
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    exports.insertUpdateLiveMonitoringFunction(
      index,
      project_id,
      responseData,
      callback
    );
  }
};

exports.inserUpdateSystemLog = async (req, res) => {
  const endpoint = config.graphql_endpoint;
  const headers = {
    "content-type": "application/json",
    Authorization: config.graphql_authorization,
  };
  const graphqlQuery = {
    operationName: "getLogsSystem",
    query: `query getLogsSystem($from: String 
    $to: String 
    $uid: String 
    $pid: String 
    $line: String) {
      logsSystem(from: $from, to: $to,
      uid: $uid, pid: $pid, line:$line) {
      line
      dateTime
      dateTimeLocal
      unitName
      unitId
      projectName
      projectId
      key value
      }}
    `,
    variables: {
      pid: req.body.project_id,
    },
  };

  const options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(graphqlQuery),
  };
  const response1 = await fetch(endpoint, options);
  const data = await response1.json();
  if (data.data) {
    // insert system log funnction
    var index = 0;
    exports.insertSystemLogDataFunction(
      index,
      data.data,
      (systemLogResposne) => {
        if (systemLogResposne == 1) {
          return response.success(
            res,
            "System Log Created Successfully",
            data.data
          );
        } else {
          return response.fail(res, "Error While Inserting system log!", "");
        }
      }
    );
  } else {
    var singleErrorDetailPayloadData = {
      error_code: 0,
      payload: JSON.stringify(graphqlQuery.variables),
      error_msg: data.errors[0].message,
    };
    Model.error_log
      .create(singleErrorDetailPayloadData)
      .then((result) => {
        return response.success(res, "Error logged in Database", data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
};
exports.insertSystemLogDataFunction = (index, systemLogData, callback) => {
  const stringifyData = JSON.stringify(systemLogData);
  const parseData = JSON.parse(stringifyData);
  var dataLength = parseData.length;
  if (parseFloat(dataLength) === 0) {
    callback(1);
    return;
  }
  var singleItemData = parseData[index];
  // check condition for insert or update data
  Model.system_logs
    .findAll({
      where: {
        project_id: singleItemData.projectId,
      },
    })
    .then((isInsertOrUpdate) => {
      if (isInsertOrUpdate.length > 0) {
        // update data
        const systemLog = {
          // project_id: singleItemData.projectId,
          project_name: singleItemData.projectName,
          unit_id: singleItemData.unitId,
          unit_name: singleItemData.unitName,
          datetime: singleItemData.dateTime,
          datetimelocal: singleItemData.dateTimeLocal,
          line: singleItemData.line,
          serial: singleItemData.serial,
          key: singleItemData.key,
          value: singleItemData.value,
        };
        Model.system_logs
          .update(systemLog, {
            where: {
              project_id: singleItemData.projectId,
            },
          })
          .then((result) => {
            //// increment
            index = parseInt(index) + 1;
            if (parseFloat(index) < parseFloat(dataLength)) {
              exports.insertSystemLogDataFunction(
                index,
                systemLogData,
                callback
              );
            } else {
              callback(1);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        // insert data
        const systemLog = {
          project_id: singleItemData.projectId,
          project_name: singleItemData.projectName,
          unit_id: singleItemData.unitId,
          unit_name: singleItemData.unitName,
          datetime: singleItemData.dateTime,
          datetimelocal: singleItemData.dateTimeLocal,
          line: singleItemData.line,
          serial: singleItemData.serial,
          key: singleItemData.key,
          value: singleItemData.value,
        };
        Model.system_logs
          .create(systemLog)
          .then((result) => {
            //// increment
            index = parseInt(index) + 1;
            if (parseFloat(index) < parseFloat(dataLength)) {
              exports.insertSystemLogDataFunction(
                index,
                systemLogData,
                callback
              );
            } else {
              callback(1);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.exportSystemLogs = async (req, res) => {
  var from_date = req.params.from_date;
  var to_date = req.params.to_date;
  var project_id = req.params.project_id;
  var unit_id = req.params.unit_id;
  var alert_type = req.params.alert_type;
  if (!from_date) {
    return response.fail(res, "From Data Required");
  }
  if (!to_date) {
    return response.fail(res, "From Data Required");
  }
  if (!project_id) {
    return response.fail(res, "From Data Required");
  }
  var unitIdSql = "";
  if (unit_id != undefined) {
    unitIdSql = ` AND unit_id = '${unit_id}'`;
  }
  var alertTypeSql = "";
  if (alert_type != undefined) {
    alertTypeSql = ` AND line = '${alert_type}'`;
  }

  var sql = `SELECT * FROM system_logs 
  WHERE project_id = '${project_id}' 
  AND datetimelocal BETWEEN '${from_date}' AND '${to_date}' 
  ${unitIdSql} ${alertTypeSql}`;
  Model.sequelize
    .query(sql, {
      type: Model.sequelize.QueryTypes.SELECT,
    })
    .then(function (systemLogResposne) {
      if (systemLogResposne.length > 0) {
        ////////
        var temp = [];
        systemLogResposne.forEach((element) => {
          temp.push({
            project_id: element.project_id,
            project_name: element.project_name,
            unit_id: element.unit_id,
            unit_name: element.unit_name,
            datetime: element.datetime,
            datetimelocal: element.datetimelocal,
            line: element.line,
            serial: element.serial,
            key: element.key,
            value: element.value,
            createdAt: element.createdAt,
            updatedAt: element.updatedAt,
          });
        });
        // excel code
        var headerContent = [
          { header: "Project Name", key: "project_name", width: 25 },
          { header: "Unit Id", key: "unit_id", width: 25 },
          { header: "Unit Name", key: "unit_name", width: 25 },
          { header: "Line", key: "line", width: 25 },
          { header: "Serial", key: "serial", width: 25 },
          { header: "City", key: "cityName", width: 25 },
          { header: "Key", key: "key", width: 25 },
          { header: "Value", key: "value", width: 25 },
          { header: "Date Time", key: "datetime", width: 25 },
          { header: "Date Time Local", key: "datetimelocal", width: 25 },
        ];
        var fileName = "systemLog";
        excelController.download(
          temp,
          headerContent,
          res,
          fileName,
          function (datares) { }
        );
        // return response.success(res, "System Log Data", systemLogResposne);
      } else {
        return response.fail(res, "No Records Found");
      }
    });
};

exports.updateflowdata = async (req, res) => {
  const endpoint = config.graphql_endpoint;

  Model.project
    .findAll({
      order: [["id", "DESC"]],
    })
    .then(async (projectsResponse) => {
      for (let i = 0; i < projectsResponse.length; i++) {
        var projectInputId = projectsResponse[i].project_code;

        const headers = {
          "content-type": "application/json",
          Authorization: config.graphql_authorization,
        };
        const graphqlQuery = {
          operationName: "getOmegasByProject",
          query: `query getOmegasByProject($id: String) {
      userProject(where: { id: $id }) {
       id
        project {
          id
          name
          type
          description
          units {
            id
            name
            lat
            long
            valves {
              id
              index
              name
              outputNum
              flow
            }
            analogInputs {
              id
              index
              name
              analogNum
            }
            digitalInput:waterMeters {
              id
              index
              name
              inputNum
            }
          }
        }
      }
    }
      `,

          // variables: { id: "cl86ts8rj217140xp5138s7iqm" },
          // console.log("id payload", req.body.id);
          variables: { id: projectInputId },
        };

        const options = {
          method: "POST",
          headers: headers,
          body: JSON.stringify(graphqlQuery),
        };

        const response1 = await fetch(endpoint, options);
        const data = await response1.json();

        // if (data.data.userProject != null) {
        if (data.data) {
          if (data.data.userProject) {
            // return response.success(res, data.data.userProject.project);
            const projectId = data.data.userProject.project.id;
            const project_name = data.data.userProject.project.name;
            if (projectId != "") {
              Model.sequelize
                .query(
                  `select id,project_code from projects where project_code = '${projectInputId}' `,
                  {
                    type: Model.sequelize.QueryTypes.SELECT,
                  }
                )
                .then((checkProjectResponse) => {
                  if (checkProjectResponse.length == 0) {
                    const singleProjectPayloadData = {
                      project_code: projectId,
                      project_name: project_name,
                      // project_type_id: project_type_id,
                      //   client: client,
                      //  contractor: contractor,
                    };
                    var project = "project";
                    Model[project]
                      .create(singleProjectPayloadData)
                      .then((singleProjectDataResponse) => {
                        const omegaData = data.data.userProject.project.units;
                        if (
                          omegaData.length != 0 &&
                          singleProjectDataResponse.length != 0
                        ) {
                          const newProjectId =
                            singleProjectDataResponse.dataValues.id;
                          const moduleName = "devices_master";
                          var counter = 0;
                          exports.createDeviceData(
                            counter,
                            newProjectId,
                            moduleName,
                            omegaData,
                            function (createDeviceDataResponse) {
                              if (createDeviceDataResponse.code === 1) {
                                Model.sequelize
                                  .query(
                                    `select id,device_name,lat,long, project_id from devices_masters where project_id = '${newProjectId}' order by id asc`,
                                    {
                                      type: Model.sequelize.QueryTypes.SELECT,
                                    }
                                  )
                                  .then((projectResponse) => {
                                    console.log("project_name" + project_name);
                                  });
                              } else {
                              }
                            }
                          );
                        } else {
                        }
                      });
                  } else {
                    /////////////////////////////////////
                    const omegaData = data.data.userProject.project.units;
                    if (omegaData.length != 0) {
                      const newProjectId = checkProjectResponse[0].id;
                      const moduleName = "devices_master";

                      var counter = 0;
                      exports.updateDeviceData(
                        counter,
                        newProjectId,
                        moduleName,
                        omegaData,
                        function (createDeviceDataResponse) {
                          if (createDeviceDataResponse.code === 1) {
                            Model.sequelize
                              .query(
                                `select id, project_id, device_name,lat,long, '${project_name}'as project_name from devices_masters where project_id = '${newProjectId}' order by id asc `,
                                {
                                  type: Model.sequelize.QueryTypes.SELECT,
                                }
                              )
                              .then((projectResponse) => { });
                          } else {
                          }
                        }
                      );
                    } else {
                    }
                    ////////////////////////////////////
                  }
                  // return response.success(res, "Omega Data", projectResponse);
                });
            } else {
            }
          } else {
            var singleErrorDetailPayloadData = {
              error_code: 0,
              payload: JSON.stringify(graphqlQuery.variables),
              error_msg: "Project has empty data in cloud",
            };
            Model.error_log
              .create(singleErrorDetailPayloadData)
              .then((result) => { })
              .catch((err) => {
                console.log(err);
              });
          }
        } else {
          // return response.fail(res, "Data Not Found");
          var singleErrorDetailPayloadData = {
            error_code: 0,
            payload: JSON.stringify(graphqlQuery.variables),
            error_msg: data.errors[0].message,
          };

          // console.log("singleErrorDetailPayloadData", singleErrorDetailPayloadData);
          Model.error_log
            .create(singleErrorDetailPayloadData)
            .then((result) => { })
            .catch((err) => {
              console.log(err);
            });
        }
      } //for end
    })
    .catch((err) => {
      console.log(err);
    });
};



exports.getOmegaFromBermad = async (req, res) => {
  const endpoint = config.graphql_endpoint;
  const projectInputId = req.body.id;
  const project_type_id = req.body.project_type_id;
  const client = req.body.client;
  const contractor = req.body.contractor;
  if (!projectInputId) {
    return response.fail(res, "Project id is required.!", "");
  }

  const headers = {
    "content-type": "application/json",
    Authorization: config.graphql_authorization,
  };
  const graphqlQuery = {
    operationName: "getOmegasByProject",
    query: `query getOmegasByProject($id: String) {
      userProject(where: { id: $id }) {
       id
        project {
          id
          name
          type
          description
          units {
            id
            name
            lat
            long
            valves  (orderBy: { index: asc }, where: { status: { notIn: DELETED } }) {
              id
              index
              name
              outputNum
              flow
            }
            analogInputs (orderBy: { index: asc }){
              id
              index
              name
              analogNum
              unitOfMeasure
            }
            digitalInput:waterMeters (orderBy: { index: asc }){
              id
              index
              name
              inputNum
            }
          }
        }
      }
    }
      `,
    variables: { id: projectInputId },
  };

  const options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(graphqlQuery),
  };

  const response1 = await fetch(endpoint, options);
  const data = await response1.json();
  if (data.data) {
    if (data.data.userProject) {
      const projectCode = data.data.userProject.id;
      const project_name = data.data.userProject.project.name;
      var omegaData = data.data.userProject.project.units; // omega
      if (projectCode != "" || projectCode != undefined) {
        Model.sequelize.query(`select id, project_code, project_name from projects where project_code = '${projectInputId}' `, {
          type: Model.sequelize.QueryTypes.SELECT,
        }).then(async (checkProjectResponse) => {
          if (checkProjectResponse.length === 0) {
            // project Insert
            const projectCreateData = {
              project_code: projectCode,
              project_name: project_name,
              project_type_id: project_type_id,
              client: client,
              contractor: contractor,
            };
            var insertedDataResponse = await Model.project.create(projectCreateData)
            projectId = insertedDataResponse.id;
          } else {
            // project Update
            if (omegaData.length > 0) {
              projectId = checkProjectResponse[0].id; // projectId
            } else {
              return response.fail(res, "No Records Found.!");
            }
          }
          /////////
          exports.createDeviceDataFunction(0, projectId, omegaData, function (createDeviceResponseData) {
            Model.sequelize.query(
              `select id,device_name,lat,long, project_id from devices_masters where project_id = '${projectId}' order by id asc`,
              {
                type: Model.sequelize.QueryTypes.SELECT,
              }).then((projectResponse) => {
                return response.success(res, "Omega Data", projectResponse);
              });
          });

        });
      } else {
        return response.fail(res, "Project Id Not Found");
      }
    } else {
      var singleErrorDetailPayloadData = {
        error_code: 0,
        payload: JSON.stringify(graphqlQuery.variables),
        error_msg: "Project has empty data in cloud",
      };
      Model.error_log.create(singleErrorDetailPayloadData).then((result) => {
        return response.success(res, "Project has empty data in cloud", data);
      }).catch((err) => {
        console.log(err);
      });
    }
  } else {
    var singleErrorDetailPayloadData = {
      error_code: 0,
      payload: JSON.stringify(graphqlQuery.variables),
      error_msg: data.errors[0].message,
    };

    Model.error_log.create(singleErrorDetailPayloadData).then((result) => {
      return response.success(res, "Error logged in Database", data);
    }).catch((err) => {
      console.log(err);
    });
  }
};

exports.createDeviceDataFunction = (index, projectId, omegaData, callback) => {
  const stringifyData = JSON.stringify(omegaData);
  const parseData = JSON.parse(stringifyData);
  var dataLength = parseData.length;
  if (parseFloat(dataLength) === 0) {
    callback(1);
    return;
  }
  var singleItemData = parseData[index];
  var omega_id = singleItemData.id;
  var valves = singleItemData.valves;
  var analogInputs = singleItemData.analogInputs;
  var digitalInput = singleItemData.digitalInput;
  Model.sequelize.query(`select * from devices_masters where omega_id = '${omega_id}' AND project_id = ${projectId}`, {
    type: Model.sequelize.QueryTypes.SELECT,
  }).then(async (omegaAlredyExistOrNot) => {
    var deviceId = ""
    if (omegaAlredyExistOrNot.length > 0) {
      var id = omegaAlredyExistOrNot[0].id
      deviceId = id
      // update data
      const updateData = {
        project_id: projectId,
        omega_id: singleItemData.id,
        device_name: singleItemData.name,
        lat: singleItemData.lat,
        long: singleItemData.long,
        active: 1
      };
      Model.devices_master.update(updateData, {
        where: {
          id: id
        },
      }).then((deviceMasterResponse) => {
      }).catch(err => {
        console.log(err)
      })
    } else {
      // insert data
      const createData = {
        project_id: projectId,
        omega_id: singleItemData.id,
        device_name: singleItemData.name,
        lat: singleItemData.lat,
        long: singleItemData.long,
        active: 1
      };
      var deviceMasterInsertResponse = await Model.devices_master.create(createData)
      deviceId = deviceMasterInsertResponse.id
    }

    exports.omegaValvesInsertDataFunction(0, deviceId, valves, function (responseData) {
      exports.omegaAnalogInputsInsertDataFunction(0, deviceId, analogInputs, function (responseData) {
        exports.omegaDigitalInputInsertDataFunction(0, deviceId, digitalInput, function (responseData) {
          //// increment  
          index = parseInt(index) + 1;
          if (parseFloat(index) < parseFloat(dataLength)) {
            exports.createDeviceDataFunction(index, projectId, omegaData, callback);
          } else {
            callback(1);
          }
        })
      })
    });

  }).catch(err => {
    console.log(err)
  })
}


exports.omegaValvesInsertDataFunction = (index, deviceId, valves, callback) => {
  const stringifyData = JSON.stringify(valves);
  const parseData = JSON.parse(stringifyData);
  var dataLength = parseData.length;
  if (parseFloat(dataLength) === 0) {
    callback(1);
    return;
  }
  var singleItemData = parseData[index];
  var inputIndexId = singleItemData.id;
  Model.sequelize.query(`select * from devices_details where device_id = '${deviceId}' AND type = '1' AND input_id = '${inputIndexId}'`, {
    type: Model.sequelize.QueryTypes.SELECT,
  }).then(async (deviceDetailsRecordAlredyExistOrNot) => {
    if (deviceDetailsRecordAlredyExistOrNot.length > 0) {
      var id = deviceDetailsRecordAlredyExistOrNot[0].id;
      var updateData = {
        device_id: deviceId,
        type: 1, //1: valves
        input_id: singleItemData.id,
        name: singleItemData.name,
        value: singleItemData.outputNum,
        input_index: singleItemData.index,
        flow: singleItemData.flow,
      };

      Model.devices_details.update(updateData, {
        where: {
          id: id
        },
      }).then((deviceDetailsResponse) => {
        //// increment  
        index = parseInt(index) + 1;
        if (parseFloat(index) < parseFloat(dataLength)) {
          exports.omegaValvesInsertDataFunction(index, deviceId, valves, callback);
        } else {
          callback(1);
        }
      }).catch(err => {
        console.log(err)
      })
    } else {
      var createData = {
        device_id: deviceId,
        type: 1, //1: valves
        input_id: singleItemData.id,
        name: singleItemData.name,
        value: singleItemData.outputNum,
        input_index: singleItemData.index,
        flow: singleItemData.flow,
      };

      Model.devices_details.create(createData).then((deviceDetailsResponse) => {
        //// increment  
        index = parseInt(index) + 1;
        if (parseFloat(index) < parseFloat(dataLength)) {
          exports.omegaValvesInsertDataFunction(index, deviceId, valves, callback);
        } else {
          callback(1);
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }).catch(err => {
    console.log(err);
  })
  /////////
}
exports.omegaAnalogInputsInsertDataFunction = (index, deviceId, analogInputs, callback) => {
  const stringifyData = JSON.stringify(analogInputs);
  const parseData = JSON.parse(stringifyData);
  var dataLength = parseData.length;
  if (parseFloat(dataLength) === 0) {
    callback(1);
    return;
  }
  var singleItemData = parseData[index];
  var inputIndexId = singleItemData.id;
  Model.sequelize.query(`select * from devices_details where device_id = '${deviceId}' AND type = '1' AND input_id = '${inputIndexId}'`, {
    type: Model.sequelize.QueryTypes.SELECT,
  }).then(async (deviceDetailsRecordAlredyExistOrNot) => {
    if (deviceDetailsRecordAlredyExistOrNot.length > 0) {
      var id = deviceDetailsRecordAlredyExistOrNot[0].id;
      var updateData = {
        device_id: deviceId,
        type: 2, //2: analog
        input_id: singleItemData.id,
        name: singleItemData.name,
        value: singleItemData.analogNum,
        input_index: singleItemData.index,
        unitOfMeasure: singleItemData.unitOfMeasure,
      };

      Model.devices_details.update(updateData, {
        where: {
          id: id
        },
      }).then((deviceDetailsResponse) => {
        //// increment  
        index = parseInt(index) + 1;
        if (parseFloat(index) < parseFloat(dataLength)) {
          exports.omegaAnalogInputsInsertDataFunction(index, deviceId, analogInputs, callback);
        } else {
          callback(1);
        }
      }).catch(err => {
        console.log(err)
      })
    } else {
      var createData = {
        device_id: deviceId,
        type: 2, //2: analog
        input_id: singleItemData.id,
        name: singleItemData.name,
        value: singleItemData.analogNum,
        input_index: singleItemData.index,
        unitOfMeasure: singleItemData.unitOfMeasure,
      };

      Model.devices_details.create(createData).then((deviceDetailsResponse) => {
        //// increment  
        index = parseInt(index) + 1;
        if (parseFloat(index) < parseFloat(dataLength)) {
          exports.omegaAnalogInputsInsertDataFunction(index, deviceId, analogInputs, callback);
        } else {
          callback(1);
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }).catch(err => {
    console.log(err);
  })
  /////////
}
exports.omegaDigitalInputInsertDataFunction = (index, deviceId, digitalInput, callback) => {
  const stringifyData = JSON.stringify(digitalInput);
  const parseData = JSON.parse(stringifyData);
  var dataLength = parseData.length;
  if (parseFloat(dataLength) === 0) {
    callback(1);
    return;
  }
  var singleItemData = parseData[index];
  var inputIndexId = singleItemData.id;
  Model.sequelize.query(`select * from devices_details where device_id = '${deviceId}' AND type = '1' AND input_id = '${inputIndexId}'`, {
    type: Model.sequelize.QueryTypes.SELECT,
  }).then(async (deviceDetailsRecordAlredyExistOrNot) => {
    if (deviceDetailsRecordAlredyExistOrNot.length > 0) {
      var id = deviceDetailsRecordAlredyExistOrNot[0].id;
      var updateData = {
        device_id: deviceId,
        type: 3, //3: digitalInput
        input_id: singleItemData.id,
        name: singleItemData.name,
        value: singleItemData.inputNum,
        input_index: singleItemData.index,
      };

      Model.devices_details.update(updateData, {
        where: {
          id: id
        },
      }).then((deviceDetailsResponse) => {
        //// increment  
        index = parseInt(index) + 1;
        if (parseFloat(index) < parseFloat(dataLength)) {
          exports.omegaDigitalInputInsertDataFunction(index, deviceId, digitalInput, callback);
        } else {
          callback(1);
        }
      }).catch(err => {
        console.log(err)
      })
    } else {
      var createData = {
        device_id: deviceId,
        type: 3, //3: digitalInput
        input_id: singleItemData.id,
        name: singleItemData.name,
        value: singleItemData.inputNum,
        input_index: singleItemData.index,
      };

      Model.devices_details.create(createData).then((deviceDetailsResponse) => {
        //// increment  
        index = parseInt(index) + 1;
        if (parseFloat(index) < parseFloat(dataLength)) {
          exports.omegaDigitalInputInsertDataFunction(index, deviceId, digitalInput, callback);
        } else {
          callback(1);
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }).catch(err => {
    console.log(err);
  })
  /////////
}


exports.messageSend = (req, res) => {
  var data = getTextMessageInput(config.whatappMobileNumber, 'Welcome to the Movie Ticket Demo App for Node.js!');
  sendMessage(data).then(function (response) {
    res.json({
      status: 200,
      code: 1,
      message: "Send Message!",
      data: "",
    });
    return;
  }).catch(err => {
    console.log(err);
  })
}
exports.farmerMasterValvesAndSchedule = (req, res) => {
  const farmer_id = req.body.farmer_id;
  var sql = `select p.device_id, pa.amount, p.measurementype, fd.*, fm.* 
  from farmer_masters as fm
  left join farmer_details as fd on fd.farmer_id = fm.id
  left join programs_amounts as pa on pa.valve_id = fd.valve_id
  left join programs as p on p.id = pa.program_id
  where fm.id ='${farmer_id}'`;
  Model.sequelize
    .query(sql, {
      type: Model.sequelize.QueryTypes.SELECT,
    })
    .then(async function (farmerDataResponse) {
      if (farmerDataResponse.length > 0) {
        // callback function
        exports.farmerMasterFunction(0, farmerDataResponse, function (farmerDataResponseData) {
          return response.success(res, "Farmer Data!", farmerDataResponseData);
        });
      } else {
        return response.fail(res, "No Data Found!");
      }
    }).catch(err => {
      console.log(err)
    })
}
exports.farmerMasterFunction = async (index, farmerDataResponse, callback) => {
  const stringifyData = JSON.stringify(farmerDataResponse);
  const parseData = JSON.parse(stringifyData);
  var dataLength = parseData.length;
  if (parseFloat(dataLength) === 0) {
    callback(1);
    return;
  }
  var singleItemData = parseData[index];

  var device_id = singleItemData.device_id;
  var project_id = singleItemData.project_id;
  var valve_id = singleItemData.valve_id;
  var sql = ``;
  if (device_id != null && project_id != null) {
    sql = `select valves from live_monitorings where device_id= '${device_id}' AND project_id= '${project_id}'`
  }
  console.log("sql--", sql);
  Model.sequelize
    .query(sql, {
      type: Model.sequelize.QueryTypes.SELECT,
    })
    .then(async function (liveMonitoringsResponse) {
      var valveStatus = '-';
      if (liveMonitoringsResponse.length > 0) {
        if (liveMonitoringsResponse[0].valves != null || liveMonitoringsResponse[0].valves != undefined) {
          var valveArray = liveMonitoringsResponse[0].valves
          for (let i = 0; i < valveArray.length; i++) {
            const element = valveArray[i];
            if (element.index === valve_id) {
              valveStatus = element.status
            }
          }
        }
      }
      parseData[index].valveStatus = valveStatus
      //// increment  
      index = parseInt(index) + 1;
      if (parseFloat(index) < parseFloat(dataLength)) {
        exports.farmerMasterFunction(index, parseData, callback);
      } else {
        callback(parseData);
      }
    }).catch(err => {
      console.log(err)
    })
}

// , socketData, socketIO
exports.getUnitStatusAPI = async (req, res) => {
  const endpoint = config.graphql_endpoint;
  const socketDeviceId = req.body.device_id;
  const socketProjectId = req.body.project_id;

  if (!socketDeviceId) {
    console.log("socket Device is required");
    return;
  }
  if (!socketProjectId) {
    console.log("socket Project is required");
    return;
  }
  // const socketDeviceId = "clahuvov851900yu4aikt9sxv";
  // const socketProjectId = 1;
  const headers = {
    "content-type": "application/json",
    Authorization: config.graphql_authorization,
  };
  const graphqlQuery = {
    operationName: "getUnitStatus",
    query: `query getUnitStatus($id: String!){
      unitStatus(id:$id){
        isOnline
        digitals
        valves {
        index status
        state
        error
        }watermeters {
        index
        flow status
        error
        totalizer
        }
        programs {
        index
        type
        cyc_left
        valve
        flow state
        leftover
        }
        analogs {
        index value
        status
        error
        }
      }
      }
    `,
    variables: {
      id: socketDeviceId,
    },
  };

  const options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(graphqlQuery),
  };
  const response1 = await fetch(endpoint, options);
  const data = await response1.json();
  if (data.data) {
    var responseData = data.data;
    responseData["omega_id"] = socketDeviceId;
    // insert live monitoring table
    exports.insertLiveMonitoringFunction(
      socketProjectId,
      socketDeviceId,
      responseData.omega_id,
      responseData.unitStatus,
      function (liveMonitroringInsertUpdateResponse) {
        Model.live_monitoring
          .findAll({
            where: { omega_id: responseData.omega_id },
          })
          .then((liveMonitoringResponse) => {
            return response.success(res, "data", liveMonitoringResponse);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    );
  } else {
    var singleErrorDetailPayloadData = {
      error_code: 0,
      payload: JSON.stringify(graphqlQuery.variables),
      error_msg: data.errors[0].message,
    };

    // console.log("singleErrorDetailPayloadData", singleErrorDetailPayloadData);
    Model.error_log
      .create(singleErrorDetailPayloadData)
      .then((result) => {
        return response.success(res, "Error logged in Database", data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
};