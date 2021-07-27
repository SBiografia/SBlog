"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var PostSchema = new _mongoose["default"].Schema({
  title: {
    type: String,
    required: true,
    index: true //검색할 때 용이하게 해줌

  },
  contents: {
    type: String,
    required: true
  },
  views: {
    type: Number,
    "default": -2 //글 작성자의 조회수는 포함 안하게 하기 위해서 -2로 함

  },
  fileUrl: {
    type: String,
    "default": "https://source.unsplash.com/random/301x201" //나중에 이미지 변경

  },
  date: {
    type: String,
    "default": (0, _moment["default"])().format("YYYY-MM-DD hh:mm:ss")
  },
  //카테고리 리스트화
  // category: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "category",
  // },
  category: [{
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "category"
  }],
  comments: [{
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "comment"
  }],
  creator: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "user"
  },
  creatorName: {
    type: String
  }
});

var Post = _mongoose["default"].model("post", PostSchema);

var _default = Post;
exports["default"] = _default;