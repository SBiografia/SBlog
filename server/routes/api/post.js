import express from "express";

//Model
import Post from "../../models/post";
import Category from "../../models/category";
import User from "../../models/user";
import Comment from "../../models/comment";
import "@babel/polyfill";
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
import { truncate } from "fs";
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
    res.json({ uploaded: true, url: req.files.map((v) => v.location) });
    console.log(res);
  } catch (e) {
    console.error(e);
    res.json({ uploaded: false, url: null });
  }
});

// //기존 api/post 라우터 ////////
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
router.get("/skip/:skip", async (req, res) => {
  try {
    // test용으로 작성한 post 전체 삭제 메시지.
    // await Post.deleteMany({});
    // await Category.deleteMany({});

    const postCount = await Post.countDocuments();

    //sort({date:-1}) : -1을 하면 최신부터 하게 됨.
    const postFindResult = await Post.find()
      .skip(Number(req.params.skip))
      .limit(6)
      .sort({ date: -1 });
    const categoryFindResult = await Category.find();
    const result = { postFindResult, categoryFindResult, postCount };

    res.json(result);
  } catch (e) {
    console.log(e);
    res.json({ msg: "더 이상 포스트가 없습니다." });
  }
});

// @route     POST api/post
// @desc      Create a Post
// @access    Private

router.post("/", auth, uploadS3.none(), async (req, res, next) => {
  try {
    const { title, contents, fileUrl, creator, category } = req.body;
    const newPost = await Post.create({
      title,
      contents,
      fileUrl,
      creator: req.user.id,
      date: moment().format("YYYY-MM-DD hh:mm:ss"),
    });
    //$push는 기존 배열에 값을 넣는 것이고, 또한 현재 해당 구문은 1개의 포스트의 값을 작성중임을 기억하시면 됩니다.
    //else 이후 구문은 카테고리 찾는 값이 있을때를 의미합니다.
    //하지만 $push를 왜 안쓰냐고 하셨죠? $push는 javascript 문법과 비슷하게 기존 배열에 값을 추가해서 넣을때를 의미합니다. 그래서
    //Category와 User 모델 입장에서는 만들어지는 포스트의 id를 배열에 넣어야 하니 $push가 쓰이는 것이고,
    //Post 모델입장에서는 1개의 포스트 모델에서 Category 값을 찾았으니, 이를 업데이트만 해주면 되기에 $push가 사용되지 않는 것입니다.

    // await category.forEach(async (item) => {
    await (async () => {
      for (let item of category) {
        const findResultId = await Category.findOne({
          categoryName: item,
        });

        if (findResultId === null || findResultId === undefined) {
          const newCategory = await Category.create({
            categoryName: item,
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
          await Category.findByIdAndUpdate(findResultId._id, {
            $push: { post: newPost._id },
          });
          await Post.findByIdAndUpdate(newPost._id, {
            $push: { category: findResultId },
          });
          await User.findByIdAndUpdate(req.user.id, {
            $push: { post: newPost._id },
          });
        }
      }
    })();

    return res.redirect(`/api/post/${newPost._id}`);
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

    res.json(post);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

// [Comments Route]

// @route Get         api/post/:id/comments
// @desc  Get All Comments
// @access public

router.get("/:id/comments", async (req, res) => {
  try {
    //path는 models/post.js 의 comments와 동일하게
    const comment = await Post.findById(req.params.id).populate({
      path: "comments",
    });
    const result = comment.comments;

    res.json(result);
  } catch (e) {
    console.log(e);
  }
});

router.post("/:id/comments", async (req, res, next) => {
  const newComment = await Comment.create({
    contents: req.body.contents,
    creator: req.body.userId,
    creatorName: req.body.userName,
    post: req.body.id,
    date: moment().format("YYYY-MM-DD hh:mm:ss"),
  });

  try {
    await Post.findByIdAndUpdate(req.body.id, {
      $push: {
        comments: newComment._id,
      },
    });
    await User.findByIdAndUpdate(req.body.userId, {
      $push: {
        comments: {
          //post_id와 comment_id 둘다 부르는 이유는, 유저가 post 에 대한 글을 삭제하면 post id를 이용해서 관련된 comment_id를 다 찾아서 같이 없애주는 세트로 동작
          //아래 변수명들은 models/user.js의 userSchema에서 comments 부분 내의 변수명과 동일하게 사용.
          post_id: req.body.id,
          comment_id: newComment._id,
        },
      },
    });
    res.json(newComment);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

// @route       Delete api/post/:id
// @desc        Delete a Post
// @access      Private

router.delete("/:id", auth, async (req, res) => {
  await Post.deleteMany({ _id: req.params.id });
  await Comment.deleteMany({ post: req.params.id });
  await User.findByIdAndUpdate(req.user.id, {
    //mongoose 에서 배열에서 어떤 값을 넣을때는 $push, 뺄 때는 $pull
    //아래 의미는 post 배열에서 req.params.id 를 찾아서 pull(빼주기)
    //배열의 이름들은 models/user.js 와 동일하게 해주기
    $pull: {
      post: req.params.id,
      comments: { post_id: req.params.id },
    },
  });
  const findResultCategoryArr = await Category.find({ post: req.params.id });

  await (async () => {
    for (let item of findResultCategoryArr) {
      const categoryUpdateResult = await Category.findByIdAndUpdate(
        item._id,
        { $pull: { post: req.params.id } },
        { new: true }
      );

      if (categoryUpdateResult.post.length === 0) {
        await Category.deleteMany({ _id: categoryUpdateResult });
      }
    }
  })();

  return res.json({ success: true });
});

// @route       Get api/post/:id/edit
// @desc        Edit Post
// @access      Private
//edit를 찾고 post 값을 내보내주는 역할
router.get("/:id/edit", auth, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate("creator", "name");
    res.json(post);
  } catch (e) {
    console.log("server/error", e);
  }
});

router.post("/:id/edit", auth, async (req, res, next) => {
  const {
    //아래는 req.body.title 이랑 같은 의미인데 깔끔하게 구조분해해서 가져와줌
    body: { title, contents, fileUrl, category, id },
  } = req;

  let beforeCateArr = await Category.find({
    //req.params.id 를 가진 Category objectId를 찾는다.
    post: req.params.id,
  });
  let newCateArr = [];
  let resultCateArr = [];

  try {
    //새로 만든 category 이름이 기존 Category 중에 있는지 먼저 찾은 다음에 없으면 새로 만들어주고, 있으면 기존꺼를 쓰면 됨
    await (async () => {
      for (let item of category) {
        let checkBefore = false;
        let befoCategory;
        //beforeArr에 item이 있는지 없는지
        for (let befoItem of beforeCateArr) {
          checkBefore = befoItem.categoryName === item ? true : false;

          if (checkBefore === true) {
            befoCategory = befoItem;

            break;
          }
        }

        if (checkBefore) {
          //있다면 resultCateArr에 넣어주고, beforeArr에서 제외하기
          resultCateArr.push(befoCategory);
          const idxCate = beforeCateArr.findIndex((temp) => {
            {
              return temp.categoryName === befoCategory.categoryName;
            }
          });
          if (idxCate > -1) {
            beforeCateArr.splice(idxCate, 1);
          }
        } else {
          //없다면 기존 Category DB에 있는지 체크해서
          const findResult = await Category.findOne({
            categoryName: item,
          });
          let newCategory;

          if (findResult === null || findResult === undefined) {
            //없다면 새로 만들어서 resultCateArr에 넣어주기.
            newCategory = await Category.create({
              categoryName: item,
            });
          } else {
            //있다면 그거를 가져와서 resultCateArr에 넣어주기.
            newCategory = findResult;
          }
          newCateArr.push(newCategory);
          resultCateArr.push(newCategory);
        }
      }
    })();

    const modified_post = await Post.findByIdAndUpdate(
      id,
      {
        title,
        contents,
        fileUrl,
        date: moment().format("YYYY-MM-DD hh:mm:ss"),
      }, //findByIdAndUpdate를 할 때는 new:true 를 해줘야 함!
      { new: true }
    );

    //Category와 User 모델 입장에서는 만들어지는 포스트의 id를 배열에 넣어야 하니 $push가 쓰이는 것이고,($push는 기존 배열에 값을 넣는 것이고)
    //Post 모델입장에서는 1개의 포스트 모델에서 Category 값을 찾았으니, 이를 업데이트만 해주면 되기에 $push가 사용되지 않는 것입니다.

    if (beforeCateArr !== null && beforeCateArr.length !== 0) {
      for (let item of beforeCateArr) {
        //before에 남아있는 친구들한테서 post_id 빼준다.
        // //변경하는 category가 기존과 다를 경우, 기존cateogry ID에 들어있는 post배열을 빼준다.
        await Post.findByIdAndUpdate(
          modified_post._id,
          { $pull: { category: item._id } },
          { new: true }
        );
        const CategoryUpdateResult = await Category.findOneAndUpdate(
          { categoryName: item.categoryName },
          { $pull: { post: req.params.id } },
          { new: true }
        ); //new 옵션을 적어줘야 업데이트가 된다고 mogoose docs에 나와있음
        //기존 배열에서 빼줬는데 길이가 0이면 기존 category리스트 삭제해준다.
        if (CategoryUpdateResult.post.length === 0) {
          await Category.deleteMany({ _id: CategoryUpdateResult });
        }
      }
    }
    if (newCateArr !== null && newCateArr.length !== 0) {
      for (let item of newCateArr) {
        //새로 만들어준 친구들한테는 post_id 추가해준다.
        await Post.findByIdAndUpdate(modified_post._id, {
          $push: { category: item._id },
        });
        await Category.findByIdAndUpdate(item._id, {
          $push: { post: modified_post._id },
        });
      }
    }

    await User.findByIdAndUpdate(req.user.id, {
      $push: { post: modified_post._id },
    });

    res.redirect(`/api/post/${modified_post.id}`);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

router.get("/category/:categoryName", async (req, res, next) => {
  try {
    const result = await Category.findOne(
      {
        categoryName: {
          $regex: req.params.categoryName,
          $options: "i",
        },
      },
      "post"
    ).populate({ path: "post" });

    res.send(result);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

//defautl 를 하는 걸 '기본 내보내기'라고 함
//오직 한 개만 내보낼 수 있게 됨
//장점이 다른곳에서 import 할 때 자유롭게 이름을 지을 수 있음
//이거 외에 '유명 내보내기'는 아래 형식
//export const name = () => {}
//import 할 때 정해놓은 '{name}'으로 불러들여야 함
export default router;
