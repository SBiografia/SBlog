import express from "express";
const router = express.Router();
import Post from "../../models/post";

router.get("/:searchTerm", async (req, res, next) => {
  try {
    const result = await Post.find({
      //title을 기준으로 검색한다는 의미
      //options 에서 i 를 적어주면 insensetive 라서 덜 민감해서 대소문자 구별없이 검색함.
      title: {
        $regex: req.params.searchTerm,
        $options: "i",
      },
    });

    console.log(result, "search Result");
    res.send(result);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

export default router;
