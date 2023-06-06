const Model = require("../../../models");
const Op = Model.Sequelize.Op;
const config = require("../../../config/jwt.secret");
const jwt = require("jsonwebtoken");
const Validator = require("fastest-validator");
var bcrypt = require("bcryptjs");
const transporter = require("../../../config/email.config");
const environment = require("../../../config/environment.config");
var http = require('http');
var url = require('url');

exports.signUp = (req, res) => {
  // console.log(req.body); return false;
  Model.user_master.findOne({ where: { email_id: req.body.email_id } })
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
          bcrypt.hash(req.body.password, salt, function (err, hash) {
            const user = {
              employee_code: req.body.employee_code,
              user_type: req.body.user_type,
              gender_id: req.body.gender_id,
              full_name: req.body.full_name,
              email_id: req.body.email_id,
              mobile_number: req.body.mobile_number,
              country_id: req.body.country_id,
              state_id: req.body.state_id,
              city_id: req.body.city_id,
              tahasil_id: req.body.tahasil_id,
              village_id: req.body.village_id,
              address: req.body.address,
              dob: req.body.dob,
              joining_date: req.body.joining_date,
              username: req.body.username,
              project_selected: req.body.project_selected,
              active: req.body.active,
              password: hash,
              created_by: req.body.created_by,
              updated_by: req.body.updated_by,
            };

            const schema = {
              full_name: { type: "string", optional: false, max: "100" },
              email_id: { type: "string", optional: false, max: "100" },
              password: { type: "string", optional: false, max: "100" },
            };

            const v = new Validator();
            const validatorResponse = v.validate(user, schema);
            if (validatorResponse !== true) {
              res.json({
                status: 400,
                code: 0,
                message: "Validation Failed",
                data: validatorResponse,
              });
              return;
            }

            Model.user_master.create(user).then((result) => {
              res.json({
                status: 200,
                code: 1,
                message: "User Created",
                data: result,
                // accesstoken: token,
              });
            });
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
};

exports.login = (req, res) => {
  // console.log(req.body);
  var username = req.body.username;
  let password = req.body.password;
  let userType = req.body.userType != undefined ? req.body.userType : '1'; // 1= admin, 2=farmer
  var userModule = 'user_master'
  if (userType == 2) {  
    // farmer
    userModule = 'farmer_master'
  }
  console.log("hello------",userModule)

  Model[userModule].findOne({ where: { username: username, active: 1 } })
    .then((user) => {
      if (user == null) {
        res.json({
          status: 401,
          code: 0,
          message: "Invalid Credential",
          data: "",
        });
      } else {
        bcrypt.compare(password, user.password, function (err, result) {
          res === true
          if (result) {
            var id = user.dataValues.id;
            const token = jwt.sign(
              { email_id: username, userId: id },
              config.secret,
              {
                expiresIn: "24h", // expires in 24 hours
              }
            );
            const data = {
              token: token,
            }
            Model.user_master
              .update(data, {
                where: {
                  id: id,
                },
              })
              .then((tokenUpdateDataResponse) => {
                res.json({
                  status: 200,
                  code: 1,
                  message: "Login Successful!!!",
                  data: user,
                  accesstoken: token,
                  userType: userType
                });
              })

          } else {
            console.log(err, result);
            res.json({
              status: 401,
              code: 0,
              message: "Invalid Credential",
              data: "",
            });
          }
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.json({
        status: 500,
        code: 0,
        message: err || "Something Went To Wrong",
        data: "",
      });
    });
};

exports.forgotPassword = (req, res) => {
  let username = req.body.username;
  Model.sequelize.query(`SELECT * FROM user_masters where active != 0 and email_id = '${username}'`, {
    type: Model.sequelize.QueryTypes.SELECT
  }).then(function (userData) {
    if (userData.length > 0) {
      var emailTo = userData[0].email_id;
      var id = userData[0].id;
      var first_name = userData[0].first_name;
      var last_name = userData[0].last_name;
      var hostname = req.headers.host; // hostname = 'localhost:8080'
      var pathname = url.parse(req.url).pathname; // pathname = '/MyApp'

      console.log(emailTo);
      var html = "Dear " + first_name + " " + last_name + ",<br/><br/>";
      html += "We are sharing a password change to access your account. The code is valid for 10 minutes and usable only once.<br/>";
      html += "Once you have click on link, you'll be prompted to set a new password immediately. This is to ensure that only you have access to your account.<br/>";
      html += "Click Here to reset password: " + 'https://bermad.disctesting.in/ChangePassword/' + id + "<br/>";
      html += "Expires in: 10 minutes";

      var mailOptions = {
        from: environment.fromEmailId,
        to: emailTo,
        subject: 'Reset Password : Bermad',
        html: html
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (!error) {
          console.log('Email sent');

          res.json({
            status: 200,
            code: 1,
            message: "Reset Password link shared on your Email ID",
            data: []
          })
        } else {
          console.log('Email not sent: ', error.message);
          res.json({
            status: 200,
            code: 0,
            message: "Error while sending mail",
            data: []
          })
        }
        // });
      })
      // .catch(err => {
      //   console.log(err);
      //   res.json({
      //     status: 500,
      //     code: 0,
      //     message: err.message || "Some Error In Login.",
      //     data: ''
      //   })
      // });
    } else {
      res.json({
        status: 200,
        code: 0,
        message: "Invalid Email Id",
        data: []
      })
    }
  }).catch(err => {
    console.log(err);
    res.json({
      status: 500,
      code: 0,
      message: err.message || "Some Error In Login.",
      data: ''
    })
  });
};

exports.changePassword = (req, res) => {
  let id = req.body.id;
  let newPassword = req.body.password;

  Model.sequelize.query(`SELECT * FROM user_masters where id = '${id}' and active = 1`, {
    type: Model.sequelize.QueryTypes.SELECT
  }).then(function (userData) {
    console.log(userData);
    if (userData.length > 0) {
      //get userType & userId;
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newPassword, salt, function (err, hash) {
          var id = userData[0].id;
          Model.sequelize.query("update user_masters set password = '" + hash + "' where id = " + id, {
            type: Model.sequelize.QueryTypes.UPDATE
          }).then(function (projects) {
            res.json({
              status: 200,
              code: 1,
              message: "Password Changed Successfully",
              data: []
            })
          });
        })
      })

    } else {
      res.json({
        status: 201,
        code: 0,
        message: "Invalid Old Password",
        data: []
      })
    }
  }).catch(err => {
    console.log(err);
    res.json({
      status: 500,
      code: 0,
      message: err.message || "Some Error In updating password.",
      data: ''
    })
  });
};
