import dotenv from "dotenv";

dotenv.config();

export default {
  MONGO_URI: process.env.MONGO_URI,
};

//(보통은 위 내용을 다 적어서 불러야되는데 dotenv를 이용해서 모듈화해주는 것)
