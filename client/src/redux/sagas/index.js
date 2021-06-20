import { all, fork } from "redux-saga/effects";
import axios from "axios";

import authSaga from "./authSaga";
import dotenv from "dotenv";

dotenv.config();
axios.defaults.baseURL = process.env.REACT_APP_BASIC_SERVER_URL;

//function* == generate 함수 : 여러 값을 반환할 수 있음(일반함수는 1개만 반환함)
export default function* rootSaga() {
  yield all([fork(authSaga)]);
}
