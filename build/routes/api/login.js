"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _auth = _interopRequireDefault(require("../../middleware/auth"));

var _index = _interopRequireDefault(require("../../config/index"));

var _user = _interopRequireDefault(require("../../models/user"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var JWT_SECRET = _index["default"].JWT_SECRET; //Mode

var router = _express["default"].Router(); // @route   POST api/auth
// @desc    Auth user
// @access  Public
// LOGIN 과정


router.post("/", function (req, res) {
  var _req$body = req.body,
      email = _req$body.email,
      password = _req$body.password; //simple validation

  if (!email || !password) {
    return res.status(400).json({
      msg: "모든 필드를 채워주세요"
    });
  } //check for existing user


  _user["default"].findOne({
    email: email
  }).then(function (user) {
    if (!user) return res.status(400).json({
      msg: "유저가 존재하지 않습니다."
    }); //validate password

    _bcryptjs["default"].compare(password, user.password).then(function (isMatch) {
      if (!isMatch) return res.status(400).json({
        msg: "비밀번호가 일치하지 않습니다."
      });

      _jsonwebtoken["default"].sign({
        id: user.id
      }, JWT_SECRET, {
        expiresIn: "2 days"
      }, function (err, token) {
        if (err) throw err;
        res.json({
          token: token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        });
      });
    });
  });
}); // LOGOUT 과정
// logout 은 front 에서 redux-saga 로 할 예정이라서 응답만 주어지면 redux로 처리라서 성공메시지만 보내주면 됨

router.post("/logout", function (req, res) {
  res.json("로그아웃 성공");
});
router.get("/user", _auth["default"], /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    var user;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return _user["default"].findById(req.user.id).select("-password");

          case 3:
            user = _context.sent;

            if (user) {
              _context.next = 6;
              break;
            }

            throw Error("유저가 존재하지 않습니다.");

          case 6:
            res.json(user);
            _context.next = 13;
            break;

          case 9:
            _context.prev = 9;
            _context.t0 = _context["catch"](0);
            console.log(_context.t0);
            res.status(400).json({
              msg: _context.t0.message
            });

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 9]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
var _default = router;
exports["default"] = _default;