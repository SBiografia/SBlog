import express from "express";
import mongoose from "mongoose";
import config from "./config";
import hpp from "hpp";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import path from "path";

//Routes
import postRoutes from "./routes/api/post";
import userRoutes from "./routes/api/user";
import loginRoutes from "./routes/api/login";
import searchRoutes from "./routes/api/search";

const app = express();
const { MONGO_URI } = config;
const prod = process.env.NODE_ENV === "production";
// contentSecurityPolicy: false,
// {
//   directives: {
//     defaultSrc: ["'self'"],
//     scriptSrc: ["'self'"],
//     styleSrc: ["'self'", "'unsafe-inline'"],
//     imgSrc: ["'self'", "data:"],
//     connectSrc: ["'self'"],
//     fontSrc: ["'self'"],
//     objectSrc: ["'self'"],
//     mediaSrc: ["'self'"],
//     frameSrc: ["'self'"],
//   },
// }
app.use(hpp());
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://sblog2021.s3.ap-northeast-2.amazonaws.com",
        ],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        connectSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: [
          "'self'",
          "https://sblog2021.s3.ap-northeast-2.amazonaws.com",

          "data:",
        ],
      },
    },
  })
);

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
app.use("/api/post", postRoutes);
app.use("/api/user", userRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/search", searchRoutes);

//서버쪽에는 주소가 다 api가 붙는데, front는 api가 빠진 주소임
//프론트에서 서버를 접근할 때는 api가 붙으니까 위에 route들이 실행되는데,
//일반 유저가 접근할 때는 api가 없는 주소이니 위에 코드들이 실행이 안되고, 아래에 있는 코드가 실행 됨.
//즉, 위에 있는 api로 실행되는 주소 외에 "*" 모든 주소들은 아래 주소들로 실행이 됨. client/build/index.html

if (prod) {
  app.use(express.static(path.join(__dirname, "../client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
  });
}

export default app;
