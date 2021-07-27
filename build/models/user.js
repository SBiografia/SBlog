"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Create Schema
var UserSchema = new _mongoose["default"].Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    "enum": ["MainJuin", "SubJuin", "User"],
    "default": "User"
  },
  register_date: {
    type: Date,
    "default": (0, _moment["default"])().format("YYYY-MM-DD hh:mm:ss")
  },
  comments: [{
    post_id: {
      type: _mongoose["default"].Schema.Types.ObjectId,
      ref: "post"
    },
    comment_id: {
      type: _mongoose["default"].Schema.Types.ObjectId,
      ref: "comments"
    }
  }],
  post: [{
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "post"
  }]
});

var User = _mongoose["default"].model("user", UserSchema);

var _default = User;
exports["default"] = _default;