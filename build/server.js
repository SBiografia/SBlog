"use strict";

var _app = _interopRequireDefault(require("./app"));

var _index = _interopRequireDefault(require("./config/index"));

var _path = _interopRequireDefault(require("path"));

var _greenlockExpress = _interopRequireDefault(require("greenlock-express"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var PORT = _index["default"].PORT; // greenlock.init({
//   //packageRoot란, 현재 프로젝트의 가장 바깥 경로 루트. '/Users/sb/ㅇㅅㅂ/WEB/MERN_blog/sblog/'
//   packageRoot: path.join(__dirname, "../"),
//   configDir: path.joing(__dirname, "../", "server/config/greenlock.d"),
//   maintainerEmail:"test1@gmail.com",
//   cluster:false
// }).serve(app, () => {
//   console.log("greenlock work")
// });
// greenlock 쓰기 전에 기존꺼

_app["default"].listen(PORT, function () {
  console.log("Server started on Port ".concat(PORT));
});