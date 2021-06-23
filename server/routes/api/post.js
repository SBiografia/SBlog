import express from "express";

//Model
import Post from "../../models/post";
import auth from "../../middleware/auth";
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
    console.log("server/api/post.js => ");
    console.log(req.files.map((v) => v.location));
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

router.post("/", auth, async (req, res, next) => {
  try {
    console.log(req, "req");
    const { title, contents, fileUrl, creator } = req.body;
    const newPost = await Post.create({
      title,
      contents,
      fileUrl,
      creator,
    });
    res.json(newPost);
  } catch (e) {
    console.log(e);
  }
});

//defautl 를 하는 걸 '기본 내보내기'라고 함
//오직 한 개만 내보낼 수 있게 됨
//장점이 다른곳에서 import 할 때 자유롭게 이름을 지을 수 있음
export default router;

//이거 외에 '유명 내보내기'는 아래 형식
//export const name = () => {}
//import 할 때 정해놓은 '{name}'으로 불러들여야 함
