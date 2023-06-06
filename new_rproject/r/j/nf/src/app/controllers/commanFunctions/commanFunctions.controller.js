const Model = require("../../models");
var fs = require("fs");
var path = require("path");
const config = require("../../config/jwt.secret");
const { response } = require("express");
const readXlsxFile = require("read-excel-file/node");
var XLSX = require("xlsx");
const fastcsv = require("fast-csv");
const moment = require("moment");
const excel = require("exceljs");
const fetch = require("node-fetch");
var yearTransactionMasterModel = Model.year_transaction_masters;

exports.uploadImageFunction = (id, file, folderName, callback) => {
  if (!file) {
    callback({ code: 0, status: "File is Required", data: "" });
    return;
  }
  if (!id) {
    callback({ code: 0, status: "Id is Required", data: "" });
    return;
  }
  var decodeData = file.replace(/^data:image\/\w+;base64,/, "");
  var extension = file.split(";")[0].split("/")[1];
  var filePath = `./uploads/${folderName}/`;

  //   if (!fs.existsSync(filePath)) {
  //     fs.mkdirSync(filePath);
  //   }
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(filePath, { recursive: true });
  }
  fs.exists(filePath, function (exists) {
    let fileName =
      id +
      new Date().getTime() +
      Math.floor(Math.random() * 10) +
      "." +
      extension;
    let finalpath = filePath + fileName;
    try {
      fs.writeFileSync(finalpath, decodeData, "base64", function (err) { });
      callback({ code: 1, status: "File Uploaded", data: fileName });
    } catch (err) {
      callback({ code: 0, status: err, data: "" });
    }
  });
};

exports.sendMailFunction = (emailTo, subject, body, callback) => {
  if (!emailTo) {
    callback({ code: 0, status: "Email To is Required", data: "" });
    return;
  }
  if (!subject) {
    callback({ code: 0, status: "Subject is Required", data: "" });
    return;
  }
  if (!body) {
    callback({ code: 0, status: "Mail body is Required", data: "" });
    return;
  }
  var nodemailer = require("nodemailer");
  var transporter = nodemailer.createTransport({
    host: config.host,
    port: 587,
    secure: false,
    auth: {
      user: config.mailUserName,
      pass: config.mailPass,
    },
  });

  var mailOptions = {
    from: config.mailUserName,
    to: emailTo,
    subject: subject,
    text: body,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      callback({ code: 0, status: error, data: "" });
    } else {
      console.log("Email sent: " + info.response);
      callback({ code: 1, status: "Email Sent", data: "" });
    }
  });
};

exports.smsGateWayFunction = (mobile, callback) => {
  if (!mobile) {
    callback({ code: 0, status: "Mobile Number is Required", data: "" });
    return;
  }
  var otp = Math.floor(1000 + Math.random() * 9000);
  var http = require("http");
  var options = {
    host: config.smsHost,
    path: config.path + mobile + "/" + otp,
  };
  callback1 = function (response) {
    var str = "";
    response.on("data", function (chunk) {
      str += chunk;
    });
    response.on("end", function () {
      const objdata = JSON.parse(str);
      if (objdata.Status == "Success") {
        callback({ code: 0, status: "OTP Sent", data: "" });
      } else {
        console.log(error);
        callback({ code: 0, status: error, data: "" });
      }
    });
  };
  http.request(options, callback1).end();
};

exports.sendNotificationToDevice = (
  senderId,
  receiverId,
  messages,
  callback
) => {
  var message = {
    app_id: config.app_id,
    contents: { en: messages },
    headings: { en: senderId },
    // included_segments: ["Subscribed Users"],
    include_player_ids: receiverId,
    content_available: true,
    small_icon: "ic_notification_icon",
    data: { notification: "You Have a Notification" },
  };

  exports.getnotification(message, function (response) {
    if (code == 1) {
      callback({ code: 1, status: response.message, data: "" });
    } else {
      callback({ code: 0, status: response.message, data: "" });
    }
  });
};

exports.getnotification = (data, callback) => {
  var headers = {
    "Content-Type": config.content_type,
    Authorization: config.authorization,
  };

  var options = {
    host: "onesignal.com",
    port: 443,
    path: "/api/v1/notifications",
    method: "POST",
    headers: headers,
  };

  var https = require("https");
  var req = https.request(options, function (res) {
    res.on("data", function (data) {
      callback({ code: 1, message: "Success", data: JSON.parse(data) });
    });
  });

  req.on("error", function (err) {
    callback({
      code: 0,
      message: err,
    });
  });

  req.write(JSON.stringify(data));
  req.end();
};

exports.importFileFunction = (filePath, filename, callback) => {
  if (!filePath) {
    callback({ code: 0, status: "File Path is Required", fileName: "" });
    return;
  }
  if (!filename) {
    callback({ code: 0, status: "File Name is Required", fileName: "" });
    return;
  }

  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(filePath, { recursive: true });
  }
  let path = filePath + filename;
  readXlsxFile(path).then((rows) => {
    rows.shift();
    console.log("rows", rows[2]);
    console.table(rows[2]);

    return false;
    callback({ code: 1, status: "Success", rows: rows });
  });
};

exports.importFileFunctionReturnAll = (filePath, filename, callback) => {
  if (!filePath) {
    callback({ code: 0, status: "File Path is Required", fileName: "" });
    return;
  }
  if (!filename) {
    callback({ code: 0, status: "File Name is Required", fileName: "" });
    return;
  }

  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(filePath, { recursive: true });
  }
  let path = filePath + filename;
  readXlsxFile(path).then((rows) => {
    rows.shift();
    // console.log("rows", rows);
    // console.table(rows);
    // return rows
    // return false;
    callback({ code: 1, status: "Success", rows: rows });
  });
};

exports.exportFileFunction = (modelName, callback) => {
  if (!modelName) {
    callback({ code: 0, status: "Model Name is Required", data: "" });
    return;
  }
  if (Model[modelName]) {
    Model[modelName]
      .findAll()
      .then((users) => {
        var filePath =
          modelName +
          "_" +
          users[0].id +
          new Date().getTime() +
          Math.floor(Math.random() * 10) +
          ".csv";
        const ws = fs.createWriteStream(filePath);
        const jsonData = JSON.parse(JSON.stringify(users));
        console.log("jsonData", jsonData);
        fastcsv
          .write(jsonData, { headers: true })
          .on("finish", function () {
            callback({ code: 1, status: "File Export", data: "" });
          })
          .pipe(ws);
      })
      .catch((err) => {
        console.log(err);
        callback({ code: 0, status: err, data: "" });
      });
  } else {
    callback({ code: 0, status: "Invalide Model Name", data: "" });
  }
};

exports.uniqueNumberFunction = (transactionId, callback) => {
  console.log("uniqueNumberFunction--", transactionId)
  var financialYearMasterId = 1
  var today = new Date();
  var currentDate = moment(today).format("YYYY-MM-DD");
  var sql = `SELECT * FROM financial_year_masters WHERE ('${currentDate}' >= "startDate" AND '${currentDate}' <= "endDate")`;
  console.log("sql--", sql)
  Model.sequelize.query(sql, {
    type: Model.sequelize.QueryTypes.SELECT,
  }).then(async (financialYearMasterData) => {
    if (financialYearMasterData.length === 0) {
      var fyCode = moment().subtract(1, 'year').format("YYYY") + '-' + moment(currentDate).format("YY")
      var startDate = moment().subtract(1, 'year').format("YYYY") + '-04-01'
      var endDate = moment(currentDate).format("YYYY") + '-03-31'
      var financialYearUpdateData = {
        fyCode: fyCode,
        startDate: startDate,
        endDate: endDate,
      }
      await Model.financial_year_master.update(financialYearUpdateData, { where: { id: financialYearMasterId }, })
    }
    Model.sequelize.query(
      `SELECT * FROM year_transaction_masters WHERE "transactionMasterId" = ${transactionId} AND "fyMasterId" = ${financialYearMasterId}`, {
      type: Model.sequelize.QueryTypes.SELECT,
    }).then(async (yearTransactionMasterData) => {
      if (yearTransactionMasterData.length == 0) {
        callback({ code: 0, status: "fail", data: "" });
        return false;
      } else {
        var id = yearTransactionMasterData[0].id;
        var seriesStartNo = yearTransactionMasterData[0].seriesStartNo + 1;
        var transactionSeries = yearTransactionMasterData[0].transactionSeries;
        var uniqueId = transactionSeries + "0" + seriesStartNo;
        const updateData = {
          fyMasterId: 1,
          transactionMasterId: transactionId,
          transactionSeries: transactionSeries,
          active: 1,
          seriesStartNo: seriesStartNo,
        };
        await yearTransactionMasterModel.update(updateData, { where: { id: id }, })
        callback({ code: 1, status: "Success", data: uniqueId });
      }
    }).catch((err) => {
      console.log(err);
    });
  }).catch((err) => {
    console.log(err);
  });
};

exports.download = (InterpreterLog, headerContent, res, fileName, callback) => {
  let workbook = new excel.Workbook();
  let worksheet = workbook.addWorksheet(fileName);
  worksheet.columns = headerContent;
  // Add Array Rows
  worksheet.addRows(InterpreterLog);
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=" + fileName + ".xlsx"
  );

  return workbook.xlsx.write(res).then(function (re) {
    callback(1);
    return false;
  });
};

exports.programStatusUpdate = (id, programStatus, callback) => {
  const programData = {
    program_status: programStatus,
  };
  console.log("id--", id);
  console.log("programData--", programData);
  Model.programs
    .update(programData, {
      where: {
        bermad_program_id: id,
      },
    })
    .then((programUpdateResponse) => {
      callback(1);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.programGraphql = async (
  endpoint,
  operationName,
  query,
  variables,
  callback
) => {
  console.log("hello");
  const headers = {
    "content-type": "application/json",
    Authorization: config.graphql_authorization,
  };
  const graphqlQuery = {
    operationName: operationName,
    query: query,
    variables: variables,
  };

  const options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(graphqlQuery),
  };
  const response1 = await fetch(endpoint, options);
  const data = await response1.json();
  if (data.data) {
    callback(data.data);
  } else {
    var singleErrorDetailPayloadData = {
      error_code: 0,
      payload: JSON.stringify(graphqlQuery.variables),
      error_msg: data.errors[0].message,
    };
    Model.error_log
      .create(singleErrorDetailPayloadData)
      .then((result) => {
        callback(0);
      })
      .catch((err) => {
        console.log(err);
      });
  }
};


exports.reportGraphql = async (
  endpoint,
  operationName,
  query,
  variables,
  callback
) => {
  const headers = {
    "content-type": "application/json",
    Authorization: config.graphql_authorization,
  };
  const graphqlQuery = {
    operationName: operationName,
    query: query,
    variables: variables,
  };

  const options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(graphqlQuery),
  };
  const response1 = await fetch(endpoint, options);
  const data = await response1.json();
  if (data.data) {
    callback(data.data);
  } else {
    console.log("data.errors[0].message----", data.errors[0].message);
    var singleErrorDetailPayloadData = {
      error_code: 0,
      payload: JSON.stringify(graphqlQuery.variables),
      error_msg: data.errors[0].message,
    };
    Model.error_log
      .create(singleErrorDetailPayloadData)
      .then((result) => {
        callback(0);
      })
      .catch((err) => {
        console.log(err);
      });
  }
};


