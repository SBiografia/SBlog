import app from "./app";
import config from "./config/index";

import path from "path";
import greenlock from "greenlock-express";

const { PORT } = config;

greenlock
  .init({
    //packageRoot란, 현재 프로젝트의 가장 바깥 경로 루트. '/Users/sb/ㅇㅅㅂ/WEB/MERN_blog/sblog/'
    //__dirname : 현재 파일의 경로
    packageRoot: path.join(__dirname, "../"),
    configDir: path.joing(__dirname, "../", "server/config/greenlock.d"),
    maintainerEmail: "test1@gmail.com",
    cluster: false,
  })
  .serve(app, () => {
    console.log("greenlock work");
  });

// greenlock 쓰기 전에 기존꺼
// app.listen(PORT, () => {
//   console.log(`Server started on Port ${PORT}`);
// });
