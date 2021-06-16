import express from "express";

//Model
import Post from "../../models/post";
import auth from "../../middleware/auth";
const router = express.Router();

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
