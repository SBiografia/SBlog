import app from "./app";
import config from "./config/index";

import path from "path";
import greenlock from "greenlock-express";

const { PORT } = config;

app.listen(PORT, () => {
  console.log(`Server started on Port ${PORT}`);
});
