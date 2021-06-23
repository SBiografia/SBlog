import express from "express";

//Model
import Post from "../../models/post";
import Category from "../../models/category";
import User from "../../models/user";
import auth from "../../middleware/auth";
import moment from "moment";
import { isNullOrUndefined } from "util";

const router = express.Router();

//AWS S3 관련
import multer from "multer"; //file들을 주고받을 수 있게 도와주는 라이브러리.
import multerS3 from "multer-s3"; //S3가 붙은거는 AWS와 주고받을 수 있게도와주는 라이브러리
import path from "path"; //path는 경로를 깊게 파악할 수 있도록 도와줌
import AWS from "aws-sdk"; //AWS를 사용할 수 있게 도와주는 개발자도구
import dotenv from "dotenv";
dotenv.config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_PRIVATE_KEY,
});

const uploadS3 = multer({
  storage: multerS3({
    s3,
    bucket: "sblog2021/upload",
    region: "api-northeast-2",
    key(req, file, cb) {
      //혹시나 파일이 동일한 파일이름이라도 날짜를 이름에 붙여줘서 구분
      const ext = path.extname(file.originalname);
      const basename = path.basename(file.originalname, ext);
      cb(null, basename + new Date().valueOf() + ext);
    },
  }),
  //fileSize 기본단위는 bytes
  limits: { fileSize: 100 * 1024 * 1024 },
});

// @route  POST api/post/image
// @desc    create a Post
// @access  Private
//아래 라우터는 Post 작성 시 이미지를 업로드하면 Editor에 보여주는 역할로서의 라우터. 최종적으로 제출하면 등록되는 것은 나중에 다시?(36강 중)
router.post("/image", uploadS3.array("upload", 5), async (req, res, next) => {
  try {
    console.log(
      "server/api/post.js => ",
      req.files.map((v) => v.location)
    );
    res.json({ uploaded: true, url: req.files.map((v) => v.location) });
    console.log(res);
  } catch (e) {
    console.error(e);
    res.json({ uploaded: false, url: null });
  }
});

// api/post
//async, await 는 ES6 에 나온 문법
router.get("/", async (req, res) => {
  const postFindResult = await Post.find();
  console.log(postFindResult, "All Post Get");
  res.json(postFindResult);
});

// @route     POST api/post
// @desc      Create a Post
// @access    Private

router.post("/", auth, uploadS3.none(), async (req, res, next) => {
  console.log("start POST api/post");
  try {
    // console.log(req, "req");
    const { title, contents, fileUrl, creator, category } = req.body;
    const newPost = await Post.create({
      title,
      contents,
      fileUrl,
      creator,
      date: moment().format("YYYY-MM-DD hh:mm:ss"),
    });
    const findResult = await Category.findOne({
      categoryName: category,
    });

    console.log("post.js => findResult =>", findResult);

    //$push는 기존 배열에 값을 넣는 것이고, 또한 현재 해당 구문은 1개의 포스트의 값을 작성중임을 기억하시면 됩니다.
    //else 이후 구문은 카테고리 찾는 값이 있을때를 의미합니다.
    //하지만 $push를 왜 안쓰냐고 하셨죠? $push는 javascript 문법과 비슷하게 기존 배열에 값을 추가해서 넣을때를 의미합니다. 그래서
    //Category와 User 모델 입장에서는 만들어지는 포스트의 id를 배열에 넣어야 하니 $push가 쓰이는 것이고,
    //Post 모델입장에서는 1개의 포스트 모델에서 Category 값을 찾았으니, 이를 업데이트만 해주면 되기에 $push가 사용되지 않는 것입니다.
    // if (isNullOrUndefined(findResult)) {
    if (findResult === null || findResult === undefined) {
      console.log("findResult is null or undefined");
      const newCategory = await Category.create({
        categoryName: category,
      });
      await Post.findByIdAndUpdate(newPost._id, {
        $push: { category: newCategory._id },
      });
      await Category.findByIdAndUpdate(newCategory._id, {
        $push: { post: newPost._id },
      });
      await User.findByIdAndUpdate(req.user.id, {
        $push: { post: newPost._id },
      });
    } else {
      await Category.findByIdAndUpdate(findResult._id, {
        $push: { post: newPost._id },
      });
      await Post.findByIdAndUpdate(newPost._id, {
        category: findResult._id,
      });
      await User.findByIdAndUpdate(req.user.id, {
        $push: { post: newPost._id },
      });
    }
    return res.redirect(`/api/post/${newPost._id}`);
    // res.json(newPost);
  } catch (e) {
    console.log(e);
  }
});

// @route       POST api/post/:id
// @desc        Detail Post
// @access      Public
router.get("/:id", async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("creator", "name")
      .populate({ path: "category", select: "categoryName" });
    post.views += 1;
    post.save();
    console.log(post);
    res.json(post);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

//defautl 를 하는 걸 '기본 내보내기'라고 함
//오직 한 개만 내보낼 수 있게 됨
//장점이 다른곳에서 import 할 때 자유롭게 이름을 지을 수 있음
export default router;

//이거 외에 '유명 내보내기'는 아래 형식
//export const name = () => {}
//import 할 때 정해놓은 '{name}'으로 불러들여야 함
