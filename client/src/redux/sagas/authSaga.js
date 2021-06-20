import axios from "axios";
import { all, fork, call, put, takeEvery } from "redux-saga/effects";

import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE } from "../types";

//LOGIN
const loginUserAPI = (loginData) => {
  console.log(loginData, "loginData");
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  return axios.post("api/auth", loginData, config);
};

function* loginUser(loginAction) {
  try {
    const result = yield call(loginUserAPI, loginAction.payload);
    console.log(result);
    yield put({
      type: LOGIN_SUCCESS,
      payload: result.data,
    });
  } catch (e) {
    yield put({
      type: LOGIN_FAILURE,
      payload: e.response,
    });
  }
}

function* watchLoginUser() {
  yield takeEvery(LOGIN_REQUEST, loginUser);
}

export default function* authSaga() {
  yield all([fork(watchLoginUser)]);
}
