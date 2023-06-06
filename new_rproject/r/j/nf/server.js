const express = require("express");
const app = require("./src/app");
//const app = express();
const http = require("http").Server(app);
var cors = require("cors");

var cp = require('child_process');
(function () {
  var r = require
  require = function (n) {
    try {
      return r(n)
    } catch (e) {
      console.log(`Module "${n}" was not found and will be installed`)
      r('child_process').exec(`npm i ${n}`, function (err, body) {
        if (err) {
          console.log(`Module "${n}" could not be installed. Try again or install manually`)
          console.log(body)
          exit(1)
        } else {
          console.log(`Module "${n}" was installed. Will try to require again`)
          try{
            return r(n)
          } catch (e) {
            console.log(`Module "${n}" could not be required. Please restart the app`)
            console.log(e)
            exit(1)
          }
        }
      })
    }
  }
})()
// Pass a http.Server instance to the listen method
//var io = require("socket.io").listen(server);
//const io = require("socket.io")(server);

require('dotenv').config();
var env = process.env.ENVIRONMENT != undefined || process.env.ENVIRONMENT != null ? process.env.ENVIRONMENT : 'development';
var config = require('./src/app/config/config.json')[env]
const PORT = config.PORT;
const router = express.Router();
var cron = require("node-cron");
const { Server } = require("socket.io");
app.use(cors());
app.use("/uploads", express.static(__dirname + "/uploads"));

// socket code start
const socketIO = require("socket.io")(http, {
  cors: { origin: config.SocketURL },
});
let users = [];
const socketController = require("./src/app/controllers/masters/masters.controller");
//Add this before the app.get() block
socketIO.on("connection", (socket) => {
  // console.log(`⚡: ${socket.id} user just connected!`);
  socket.to("room1").emit("hellohi");
  socket.on("message", (data) => {
    socketIO.emit("messageResponse", data);
    socketController.getUnitStatus("", "", data, socketIO);
  });
  socket.emit("newMessage", {
    from: "jen@mds",
    text: "hepppp",
    createdAt: 123,
  });
  socket.on("send_message", (data) => { });
  socket.on("typing", (data) => {
    socket.broadcast.emit("typingResponse", data);
  });

  socket.on("newUser", (data) => {
    users.push(data);
    socketIO.emit("newUserResponse", users);
  });

  socket.on("taskResponse", (data) => {
    //calling a function which is inside the router so we can send a res back
    sendResponse(data);
  });
  socket.on("disconnect", () => {
    users = users.filter((user) => user.socketID !== socket.id);
    socketIO.emit("newMessage", users);
    socket.disconnect();
  });
});
// socket code end
const cronController = require("./src/app/controllers/masters/masters.controller");
// cron code start
// cron.schedule("*/2 * * * *", () => {
//   console.log("running a task liveMonitoring");
//   cronController.liveMonitoring();
// });
// cron.schedule("*/15 * * * *", () => {
//   console.log("running a task updateflowdata");
//   cronController.updateflowdata();
// });

// auto npm i 
const imgToPDF = require('image-to-pdf')



http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
