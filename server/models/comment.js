import mongoose from "mongoose";
import moment from "moment";

const CommentSchema = new mongoose.Schema({
  contents: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    default: moment().format("YYYY-MM-DD hh:mm:ss"),
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "post",
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  creatorName: { type: String }, //creator 를 통해서 불러오게 되면 db를 타고타고 들어가서 user에서 이름을 가져와야 해서 별도로 만들어줌
});

const Comment = mongoose.model("comment", CommentSchema);

export default Comment;
