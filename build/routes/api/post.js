"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _post = _interopRequireDefault(require("../../models/post"));

var _category = _interopRequireDefault(require("../../models/category"));

var _user = _interopRequireDefault(require("../../models/user"));

var _comment = _interopRequireDefault(require("../../models/comment"));

require("@babel/polyfill");

var _auth = _interopRequireDefault(require("../../middleware/auth"));

var _moment = _interopRequireDefault(require("moment"));

var _util = require("util");

var _multer = _interopRequireDefault(require("multer"));

var _multerS = _interopRequireDefault(require("multer-s3"));

var _path = _interopRequireDefault(require("path"));

var _awsSdk = _interopRequireDefault(require("aws-sdk"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _fs = require("fs");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var router = _express["default"].Router(); //AWS S3 관련


_dotenv["default"].config();

var s3 = new _awsSdk["default"].S3({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_PRIVATE_KEY
});
var uploadS3 = (0, _multer["default"])({
  storage: (0, _multerS["default"])({
    s3: s3,
    bucket: "sblog2021/upload",
    region: "api-northeast-2",
    key: function key(req, file, cb) {
      //혹시나 파일이 동일한 파일이름이라도 날짜를 이름에 붙여줘서 구분
      var ext = _path["default"].extname(file.originalname);

      var basename = _path["default"].basename(file.originalname, ext);

      cb(null, basename + new Date().valueOf() + ext);
    }
  }),
  //fileSize 기본단위는 bytes
  limits: {
    fileSize: 100 * 1024 * 1024
  }
}); // @route  POST api/post/image
// @desc    create a Post
// @access  Private
//아래 라우터는 Post 작성 시 이미지를 업로드하면 Editor에 보여주는 역할로서의 라우터. 최종적으로 제출하면 등록되는 것은 나중에 다시?(36강 중)

router.post("/image", uploadS3.array("upload", 5), /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res, next) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            try {
              res.json({
                uploaded: true,
                url: req.files.map(function (v) {
                  return v.location;
                })
              });
              console.log(res);
            } catch (e) {
              console.error(e);
              res.json({
                uploaded: false,
                url: null
              });
            }

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}()); // //기존 api/post 라우터 ////////
// // api/post
// //async, await 는 ES6 에 나온 문법
// router.get("/", async (req, res) => {
//   const postFindResult = await Post.find();
//   const categoryFindResult = await Category.find();
//   const result = { postFindResult, categoryFindResult };
//   res.json(result);
// });
//  @route    GET api/post
//  @desc     More Loading Posts
//  @access   public

router.get("/skip/:skip", /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
    var postCount, postFindResult, categoryFindResult, result;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return _post["default"].countDocuments();

          case 3:
            postCount = _context2.sent;
            _context2.next = 6;
            return _post["default"].find().skip(Number(req.params.skip)).limit(6).sort({
              date: -1
            });

          case 6:
            postFindResult = _context2.sent;
            _context2.next = 9;
            return _category["default"].find();

          case 9:
            categoryFindResult = _context2.sent;
            result = {
              postFindResult: postFindResult,
              categoryFindResult: categoryFindResult,
              postCount: postCount
            };
            res.json(result);
            _context2.next = 18;
            break;

          case 14:
            _context2.prev = 14;
            _context2.t0 = _context2["catch"](0);
            console.log(_context2.t0);
            res.json({
              msg: "더 이상 포스트가 없습니다."
            });

          case 18:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 14]]);
  }));

  return function (_x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}()); // @route     POST api/post
// @desc      Create a Post
// @access    Private

router.post("/", _auth["default"], uploadS3.none(), /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res, next) {
    var _req$body, title, contents, fileUrl, creator, category, newPost;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _req$body = req.body, title = _req$body.title, contents = _req$body.contents, fileUrl = _req$body.fileUrl, creator = _req$body.creator, category = _req$body.category;
            _context4.next = 4;
            return _post["default"].create({
              title: title,
              contents: contents,
              fileUrl: fileUrl,
              creator: req.user.id,
              date: (0, _moment["default"])().format("YYYY-MM-DD hh:mm:ss")
            });

          case 4:
            newPost = _context4.sent;
            _context4.next = 7;
            return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
              var _iterator, _step, item, findResultId, newCategory;

              return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                  switch (_context3.prev = _context3.next) {
                    case 0:
                      _iterator = _createForOfIteratorHelper(category);
                      _context3.prev = 1;

                      _iterator.s();

                    case 3:
                      if ((_step = _iterator.n()).done) {
                        _context3.next = 28;
                        break;
                      }

                      item = _step.value;
                      _context3.next = 7;
                      return _category["default"].findOne({
                        categoryName: item
                      });

                    case 7:
                      findResultId = _context3.sent;

                      if (!(findResultId === null || findResultId === undefined)) {
                        _context3.next = 20;
                        break;
                      }

                      _context3.next = 11;
                      return _category["default"].create({
                        categoryName: item
                      });

                    case 11:
                      newCategory = _context3.sent;
                      _context3.next = 14;
                      return _post["default"].findByIdAndUpdate(newPost._id, {
                        $push: {
                          category: newCategory._id
                        }
                      });

                    case 14:
                      _context3.next = 16;
                      return _category["default"].findByIdAndUpdate(newCategory._id, {
                        $push: {
                          post: newPost._id
                        }
                      });

                    case 16:
                      _context3.next = 18;
                      return _user["default"].findByIdAndUpdate(req.user.id, {
                        $push: {
                          post: newPost._id
                        }
                      });

                    case 18:
                      _context3.next = 26;
                      break;

                    case 20:
                      _context3.next = 22;
                      return _category["default"].findByIdAndUpdate(findResultId._id, {
                        $push: {
                          post: newPost._id
                        }
                      });

                    case 22:
                      _context3.next = 24;
                      return _post["default"].findByIdAndUpdate(newPost._id, {
                        $push: {
                          category: findResultId
                        }
                      });

                    case 24:
                      _context3.next = 26;
                      return _user["default"].findByIdAndUpdate(req.user.id, {
                        $push: {
                          post: newPost._id
                        }
                      });

                    case 26:
                      _context3.next = 3;
                      break;

                    case 28:
                      _context3.next = 33;
                      break;

                    case 30:
                      _context3.prev = 30;
                      _context3.t0 = _context3["catch"](1);

                      _iterator.e(_context3.t0);

                    case 33:
                      _context3.prev = 33;

                      _iterator.f();

                      return _context3.finish(33);

                    case 36:
                    case "end":
                      return _context3.stop();
                  }
                }
              }, _callee3, null, [[1, 30, 33, 36]]);
            }))();

          case 7:
            return _context4.abrupt("return", res.redirect("/api/post/".concat(newPost._id)));

          case 10:
            _context4.prev = 10;
            _context4.t0 = _context4["catch"](0);
            console.log(_context4.t0);

          case 13:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 10]]);
  }));

  return function (_x6, _x7, _x8) {
    return _ref3.apply(this, arguments);
  };
}()); // @route       POST api/post/:id
// @desc        Detail Post
// @access      Public

router.get("/:id", /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(req, res, next) {
    var post;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            _context5.next = 3;
            return _post["default"].findById(req.params.id).populate("creator", "name").populate({
              path: "category",
              select: "categoryName"
            });

          case 3:
            post = _context5.sent;
            post.views += 1;
            post.save();
            res.json(post);
            _context5.next = 13;
            break;

          case 9:
            _context5.prev = 9;
            _context5.t0 = _context5["catch"](0);
            console.error(_context5.t0);
            next(_context5.t0);

          case 13:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[0, 9]]);
  }));

  return function (_x9, _x10, _x11) {
    return _ref5.apply(this, arguments);
  };
}()); // [Comments Route]
// @route Get         api/post/:id/comments
// @desc  Get All Comments
// @access public

router.get("/:id/comments", /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(req, res) {
    var comment, result;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;
            _context6.next = 3;
            return _post["default"].findById(req.params.id).populate({
              path: "comments"
            });

          case 3:
            comment = _context6.sent;
            result = comment.comments;
            res.json(result);
            _context6.next = 11;
            break;

          case 8:
            _context6.prev = 8;
            _context6.t0 = _context6["catch"](0);
            console.log(_context6.t0);

          case 11:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[0, 8]]);
  }));

  return function (_x12, _x13) {
    return _ref6.apply(this, arguments);
  };
}());
router.post("/:id/comments", /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(req, res, next) {
    var newComment;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return _comment["default"].create({
              contents: req.body.contents,
              creator: req.body.userId,
              creatorName: req.body.userName,
              post: req.body.id,
              date: (0, _moment["default"])().format("YYYY-MM-DD hh:mm:ss")
            });

          case 2:
            newComment = _context7.sent;
            _context7.prev = 3;
            _context7.next = 6;
            return _post["default"].findByIdAndUpdate(req.body.id, {
              $push: {
                comments: newComment._id
              }
            });

          case 6:
            _context7.next = 8;
            return _user["default"].findByIdAndUpdate(req.body.userId, {
              $push: {
                comments: {
                  //post_id와 comment_id 둘다 부르는 이유는, 유저가 post 에 대한 글을 삭제하면 post id를 이용해서 관련된 comment_id를 다 찾아서 같이 없애주는 세트로 동작
                  //아래 변수명들은 models/user.js의 userSchema에서 comments 부분 내의 변수명과 동일하게 사용.
                  post_id: req.body.id,
                  comment_id: newComment._id
                }
              }
            });

          case 8:
            res.json(newComment);
            _context7.next = 15;
            break;

          case 11:
            _context7.prev = 11;
            _context7.t0 = _context7["catch"](3);
            console.log(_context7.t0);
            next(_context7.t0);

          case 15:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[3, 11]]);
  }));

  return function (_x14, _x15, _x16) {
    return _ref7.apply(this, arguments);
  };
}()); // @route       Delete api/post/:id
// @desc        Delete a Post
// @access      Private

router["delete"]("/:id", _auth["default"], /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(req, res) {
    var findResultCategoryArr;
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.next = 2;
            return _post["default"].deleteMany({
              _id: req.params.id
            });

          case 2:
            _context9.next = 4;
            return _comment["default"].deleteMany({
              post: req.params.id
            });

          case 4:
            _context9.next = 6;
            return _user["default"].findByIdAndUpdate(req.user.id, {
              //mongoose 에서 배열에서 어떤 값을 넣을때는 $push, 뺄 때는 $pull
              //아래 의미는 post 배열에서 req.params.id 를 찾아서 pull(빼주기)
              //배열의 이름들은 models/user.js 와 동일하게 해주기
              $pull: {
                post: req.params.id,
                comments: {
                  post_id: req.params.id
                }
              }
            });

          case 6:
            _context9.next = 8;
            return _category["default"].find({
              post: req.params.id
            });

          case 8:
            findResultCategoryArr = _context9.sent;
            _context9.next = 11;
            return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
              var _iterator2, _step2, item, categoryUpdateResult;

              return regeneratorRuntime.wrap(function _callee8$(_context8) {
                while (1) {
                  switch (_context8.prev = _context8.next) {
                    case 0:
                      _iterator2 = _createForOfIteratorHelper(findResultCategoryArr);
                      _context8.prev = 1;

                      _iterator2.s();

                    case 3:
                      if ((_step2 = _iterator2.n()).done) {
                        _context8.next = 13;
                        break;
                      }

                      item = _step2.value;
                      _context8.next = 7;
                      return _category["default"].findByIdAndUpdate(item._id, {
                        $pull: {
                          post: req.params.id
                        }
                      }, {
                        "new": true
                      });

                    case 7:
                      categoryUpdateResult = _context8.sent;

                      if (!(categoryUpdateResult.post.length === 0)) {
                        _context8.next = 11;
                        break;
                      }

                      _context8.next = 11;
                      return _category["default"].deleteMany({
                        _id: categoryUpdateResult
                      });

                    case 11:
                      _context8.next = 3;
                      break;

                    case 13:
                      _context8.next = 18;
                      break;

                    case 15:
                      _context8.prev = 15;
                      _context8.t0 = _context8["catch"](1);

                      _iterator2.e(_context8.t0);

                    case 18:
                      _context8.prev = 18;

                      _iterator2.f();

                      return _context8.finish(18);

                    case 21:
                    case "end":
                      return _context8.stop();
                  }
                }
              }, _callee8, null, [[1, 15, 18, 21]]);
            }))();

          case 11:
            return _context9.abrupt("return", res.json({
              success: true
            }));

          case 12:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));

  return function (_x17, _x18) {
    return _ref8.apply(this, arguments);
  };
}()); // @route       Get api/post/:id/edit
// @desc        Edit Post
// @access      Private
//edit를 찾고 post 값을 내보내주는 역할

router.get("/:id/edit", _auth["default"], /*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(req, res, next) {
    var post;
    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.prev = 0;
            _context10.next = 3;
            return _post["default"].findById(req.params.id).populate("creator", "name");

          case 3:
            post = _context10.sent;
            res.json(post);
            _context10.next = 10;
            break;

          case 7:
            _context10.prev = 7;
            _context10.t0 = _context10["catch"](0);
            console.log("server/error", _context10.t0);

          case 10:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10, null, [[0, 7]]);
  }));

  return function (_x19, _x20, _x21) {
    return _ref10.apply(this, arguments);
  };
}());
router.post("/:id/edit", _auth["default"], /*#__PURE__*/function () {
  var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(req, res, next) {
    var _req$body2, title, contents, fileUrl, category, id, beforeCateArr, newCateArr, resultCateArr, modified_post, _iterator5, _step5, item, CategoryUpdateResult, _iterator6, _step6, _item;

    return regeneratorRuntime.wrap(function _callee12$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            _req$body2 = req.body, title = _req$body2.title, contents = _req$body2.contents, fileUrl = _req$body2.fileUrl, category = _req$body2.category, id = _req$body2.id;
            _context13.next = 3;
            return _category["default"].find({
              //req.params.id 를 가진 Category objectId를 찾는다.
              post: req.params.id
            });

          case 3:
            beforeCateArr = _context13.sent;
            newCateArr = [];
            resultCateArr = [];
            _context13.prev = 6;
            _context13.next = 9;
            return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11() {
              var _iterator3, _step3, _loop;

              return regeneratorRuntime.wrap(function _callee11$(_context12) {
                while (1) {
                  switch (_context12.prev = _context12.next) {
                    case 0:
                      _iterator3 = _createForOfIteratorHelper(category);
                      _context12.prev = 1;
                      _loop = /*#__PURE__*/regeneratorRuntime.mark(function _loop() {
                        var item, checkBefore, befoCategory, _iterator4, _step4, befoItem, idxCate, findResult, newCategory;

                        return regeneratorRuntime.wrap(function _loop$(_context11) {
                          while (1) {
                            switch (_context11.prev = _context11.next) {
                              case 0:
                                item = _step3.value;
                                checkBefore = false;
                                befoCategory = void 0; //beforeArr에 item이 있는지 없는지

                                //beforeArr에 item이 있는지 없는지
                                _iterator4 = _createForOfIteratorHelper(beforeCateArr);
                                _context11.prev = 4;

                                _iterator4.s();

                              case 6:
                                if ((_step4 = _iterator4.n()).done) {
                                  _context11.next = 14;
                                  break;
                                }

                                befoItem = _step4.value;
                                checkBefore = befoItem.categoryName === item ? true : false;

                                if (!(checkBefore === true)) {
                                  _context11.next = 12;
                                  break;
                                }

                                befoCategory = befoItem;
                                return _context11.abrupt("break", 14);

                              case 12:
                                _context11.next = 6;
                                break;

                              case 14:
                                _context11.next = 19;
                                break;

                              case 16:
                                _context11.prev = 16;
                                _context11.t0 = _context11["catch"](4);

                                _iterator4.e(_context11.t0);

                              case 19:
                                _context11.prev = 19;

                                _iterator4.f();

                                return _context11.finish(19);

                              case 22:
                                if (!checkBefore) {
                                  _context11.next = 28;
                                  break;
                                }

                                //있다면 resultCateArr에 넣어주고, beforeArr에서 제외하기
                                resultCateArr.push(befoCategory);
                                idxCate = beforeCateArr.findIndex(function (temp) {
                                  {
                                    return temp.categoryName === befoCategory.categoryName;
                                  }
                                });

                                if (idxCate > -1) {
                                  beforeCateArr.splice(idxCate, 1);
                                }

                                _context11.next = 40;
                                break;

                              case 28:
                                _context11.next = 30;
                                return _category["default"].findOne({
                                  categoryName: item
                                });

                              case 30:
                                findResult = _context11.sent;

                                if (!(findResult === null || findResult === undefined)) {
                                  _context11.next = 37;
                                  break;
                                }

                                _context11.next = 34;
                                return _category["default"].create({
                                  categoryName: item
                                });

                              case 34:
                                newCategory = _context11.sent;
                                _context11.next = 38;
                                break;

                              case 37:
                                //있다면 그거를 가져와서 resultCateArr에 넣어주기.
                                newCategory = findResult;

                              case 38:
                                newCateArr.push(newCategory);
                                resultCateArr.push(newCategory);

                              case 40:
                              case "end":
                                return _context11.stop();
                            }
                          }
                        }, _loop, null, [[4, 16, 19, 22]]);
                      });

                      _iterator3.s();

                    case 4:
                      if ((_step3 = _iterator3.n()).done) {
                        _context12.next = 8;
                        break;
                      }

                      return _context12.delegateYield(_loop(), "t0", 6);

                    case 6:
                      _context12.next = 4;
                      break;

                    case 8:
                      _context12.next = 13;
                      break;

                    case 10:
                      _context12.prev = 10;
                      _context12.t1 = _context12["catch"](1);

                      _iterator3.e(_context12.t1);

                    case 13:
                      _context12.prev = 13;

                      _iterator3.f();

                      return _context12.finish(13);

                    case 16:
                    case "end":
                      return _context12.stop();
                  }
                }
              }, _callee11, null, [[1, 10, 13, 16]]);
            }))();

          case 9:
            _context13.next = 11;
            return _post["default"].findByIdAndUpdate(id, {
              title: title,
              contents: contents,
              fileUrl: fileUrl,
              date: (0, _moment["default"])().format("YYYY-MM-DD hh:mm:ss")
            }, //findByIdAndUpdate를 할 때는 new:true 를 해줘야 함!
            {
              "new": true
            });

          case 11:
            modified_post = _context13.sent;

            if (!(beforeCateArr !== null && beforeCateArr.length !== 0)) {
              _context13.next = 36;
              break;
            }

            _iterator5 = _createForOfIteratorHelper(beforeCateArr);
            _context13.prev = 14;

            _iterator5.s();

          case 16:
            if ((_step5 = _iterator5.n()).done) {
              _context13.next = 28;
              break;
            }

            item = _step5.value;
            _context13.next = 20;
            return _post["default"].findByIdAndUpdate(modified_post._id, {
              $pull: {
                category: item._id
              }
            }, {
              "new": true
            });

          case 20:
            _context13.next = 22;
            return _category["default"].findOneAndUpdate({
              categoryName: item.categoryName
            }, {
              $pull: {
                post: req.params.id
              }
            }, {
              "new": true
            });

          case 22:
            CategoryUpdateResult = _context13.sent;

            if (!(CategoryUpdateResult.post.length === 0)) {
              _context13.next = 26;
              break;
            }

            _context13.next = 26;
            return _category["default"].deleteMany({
              _id: CategoryUpdateResult
            });

          case 26:
            _context13.next = 16;
            break;

          case 28:
            _context13.next = 33;
            break;

          case 30:
            _context13.prev = 30;
            _context13.t0 = _context13["catch"](14);

            _iterator5.e(_context13.t0);

          case 33:
            _context13.prev = 33;

            _iterator5.f();

            return _context13.finish(33);

          case 36:
            if (!(newCateArr !== null && newCateArr.length !== 0)) {
              _context13.next = 56;
              break;
            }

            _iterator6 = _createForOfIteratorHelper(newCateArr);
            _context13.prev = 38;

            _iterator6.s();

          case 40:
            if ((_step6 = _iterator6.n()).done) {
              _context13.next = 48;
              break;
            }

            _item = _step6.value;
            _context13.next = 44;
            return _post["default"].findByIdAndUpdate(modified_post._id, {
              $push: {
                category: _item._id
              }
            });

          case 44:
            _context13.next = 46;
            return _category["default"].findByIdAndUpdate(_item._id, {
              $push: {
                post: modified_post._id
              }
            });

          case 46:
            _context13.next = 40;
            break;

          case 48:
            _context13.next = 53;
            break;

          case 50:
            _context13.prev = 50;
            _context13.t1 = _context13["catch"](38);

            _iterator6.e(_context13.t1);

          case 53:
            _context13.prev = 53;

            _iterator6.f();

            return _context13.finish(53);

          case 56:
            _context13.next = 58;
            return _user["default"].findByIdAndUpdate(req.user.id, {
              $push: {
                post: modified_post._id
              }
            });

          case 58:
            res.redirect("/api/post/".concat(modified_post.id));
            _context13.next = 65;
            break;

          case 61:
            _context13.prev = 61;
            _context13.t2 = _context13["catch"](6);
            console.log(_context13.t2);
            next(_context13.t2);

          case 65:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee12, null, [[6, 61], [14, 30, 33, 36], [38, 50, 53, 56]]);
  }));

  return function (_x22, _x23, _x24) {
    return _ref11.apply(this, arguments);
  };
}());
router.get("/category/:categoryName", /*#__PURE__*/function () {
  var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(req, res, next) {
    var result;
    return regeneratorRuntime.wrap(function _callee13$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            _context14.prev = 0;
            _context14.next = 3;
            return _category["default"].findOne({
              categoryName: {
                $regex: req.params.categoryName,
                $options: "i"
              }
            }, "post").populate({
              path: "post"
            });

          case 3:
            result = _context14.sent;
            res.send(result);
            _context14.next = 11;
            break;

          case 7:
            _context14.prev = 7;
            _context14.t0 = _context14["catch"](0);
            console.log(_context14.t0);
            next(_context14.t0);

          case 11:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee13, null, [[0, 7]]);
  }));

  return function (_x25, _x26, _x27) {
    return _ref13.apply(this, arguments);
  };
}()); //defautl 를 하는 걸 '기본 내보내기'라고 함
//오직 한 개만 내보낼 수 있게 됨
//장점이 다른곳에서 import 할 때 자유롭게 이름을 지을 수 있음
//이거 외에 '유명 내보내기'는 아래 형식
//export const name = () => {}
//import 할 때 정해놓은 '{name}'으로 불러들여야 함

var _default = router;
exports["default"] = _default;