"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _config = _interopRequireDefault(require("./config"));

var _hpp = _interopRequireDefault(require("hpp"));

var _helmet = _interopRequireDefault(require("helmet"));

var _cors = _interopRequireDefault(require("cors"));

var _morgan = _interopRequireDefault(require("morgan"));

var _path = _interopRequireDefault(require("path"));

var _post = _interopRequireDefault(require("./routes/api/post"));

var _user = _interopRequireDefault(require("./routes/api/user"));

var _login = _interopRequireDefault(require("./routes/api/login"));

var _search = _interopRequireDefault(require("./routes/api/search"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

//Routes
var app = (0, _express["default"])();
var MONGO_URI = _config["default"].MONGO_URI;
var prod = process.env.NODE_ENV === "production";
app.use((0, _hpp["default"])());
app.use((0, _helmet["default"])({
  contentSecurityPolicy: false
})); //cors는 브라우저가 다른 도메인이나 포트가 다른 서버에 자원을 요청하는 것
//보통 SPA에서는 react, vue나 같은 SPA에서는 서버에서 설정을 해주는데
//origin이라 함은 허락하고자 하는 주소를 말하는데, true를 적으면 모두 허용해주게 됨
//credentials 는 지금 설정한 cors를 브라우저의 헤더에 추가하게 됨

app.use((0, _cors["default"])({
  origin: true,
  credentials: true
})); //morgan은 개발할 때 log를 볼 수 있게 해주는 것

app.use((0, _morgan["default"])("dev"));
app.use(_express["default"].json());

_mongoose["default"].connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  //경고메시지 사라지게 하기.
  //Mongoose: `findOneAndUpdate()` and `findOneAndDelete()` without the `useFindAndModify` option set to false are deprecated
  //위 옵션 에러 메시지 안보이게 하기
  useFindAndModify: false
}).then(function () {
  console.log("MongoDB connecting Success!");
})["catch"](function (e) {
  console.log(e);
}); //Use routes


app.use("/api/post", _post["default"]);
app.use("/api/user", _user["default"]);
app.use("/api/login", _login["default"]);
app.use("/api/search", _search["default"]); //서버쪽에는 주소가 다 api가 붙는데, front는 api가 빠진 주소임
//프론트에서 서버를 접근할 때는 api가 붙으니까 위에 route들이 실행되는데,
//일반 유저가 접근할 때는 api가 없는 주소이니 위에 코드들이 실행이 안되고, 아래에 있는 코드가 실행 됨.
//즉, 위에 있는 api로 실행되는 주소 외에 "*" 모든 주소들은 아래 주소들로 실행이 됨. client/build/index.html

if (prod) {
  app.use(_express["default"]["static"](_path["default"].join(__dirname, "../client/build")));
  app.get("*", function (req, res) {
    res.sendFile(_path["default"].resolve(__dirname, "../client/build", "index.html"));
  });
}

var _default = app;
exports["default"] = _default;