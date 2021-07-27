"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var CommentSchema = new _mongoose["default"].Schema({
  contents: {
    type: String,
    required: true
  },
  date: {
    type: String,
    "default": (0, _moment["default"])().format("YYYY-MM-DD hh:mm:ss")
  },
  post: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "post"
  },
  creator: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "user"
  },
  creatorName: {
    type: String
  } //creator 를 통해서 불러오게 되면 db를 타고타고 들어가서 user에서 이름을 가져와야 해서 별도로 만들어줌

});

var Comment = _mongoose["default"].model("comment", CommentSchema);

var _default = Comment;
exports["default"] = _default;