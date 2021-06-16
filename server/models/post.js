import mongoose from "mongoose";
import moment from "moment";

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: true, //검색할 때 용이하게 해줌
  },
  contents: {
    type: String,
    required: true,
  },
  views: {
    type: Number,
    default: -2, //글 작성자의 조회수는 포함 안하게 하기 위해서 -2로 함
  },
  fileUrl: {
    type: String,
    default: "https://source.unsplash.com/random/301x201", //나중에 이미지 변경
  },
  date: {
    type: String,
    default: moment().format("YYYY-MM-DD hh:mm:ss"),
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "comment",
    },
  ],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});

const Post = mongoose.model("post", PostSchema);

export default Post;
