"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Create Schema
var CategorySchema = new _mongoose["default"].Schema({
  categoryName: {
    type: String,
    "default": "미분류"
  },
  post: [{
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "post"
  }]
});

var Category = _mongoose["default"].model("category", CategorySchema);

var _default = Category;
exports["default"] = _default;