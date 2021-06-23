import express from "express";
import mongoose from "mongoose";
import config from "./config";
import hpp from "hpp";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";

//Routes
import postRoutes from "./routes/api/post";
import userRoutes from "./routes/api/user";
import loginRoutes from "./routes/api/login";

const app = express();
const { MONGO_URI } = config;

app.use(hpp());
app.use(helmet());

//cors는 브라우저가 다른 도메인이나 포트가 다른 서버에 자원을 요청하는 것
//보통 SPA에서는 react, vue나 같은 SPA에서는 서버에서 설정을 해주는데
//origin이라 함은 허락하고자 하는 주소를 말하는데, true를 적으면 모두 허용해주게 됨
//credentials 는 지금 설정한 cors를 브라우저의 헤더에 추가하게 됨
app.use(cors({ origin: true, credentials: true }));
//morgan은 개발할 때 log를 볼 수 있게 해주는 것
app.use(morgan("dev"));

app.use(express.json());

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true, //경고메시지 사라지게 하기.
    //Mongoose: `findOneAndUpdate()` and `findOneAndDelete()` without the `useFindAndModify` option set to false are deprecated
    //위 옵션 에러 메시지 안보이게 하기
    useFindAndModify: false,
  })
  .then(() => {
    console.log("MongoDB connecting Success!");
  })
  .catch((e) => {
    console.log(e);
  });

//Use routes
app.get("/");
app.use("/api/post", postRoutes);
app.use("/api/user", userRoutes);
app.use("/api/login", loginRoutes);

export default app;
