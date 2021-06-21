import axios from "axios";
import { all, fork, call, put, takeEvery } from "redux-saga/effects";

import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE,
  LOGOUT_REQUEST,
} from "../types";

//LOGIN
const loginUserAPI = (loginData) => {
  console.log(loginData, "loginData");
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  return axios.post("api/login", loginData, config);
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
  console.log("watchLoginUser");
  yield takeEvery(LOGIN_REQUEST, loginUser);
}

//LOGOUT
function* logout(logoutAction) {
  try {
    yield put({
      type: LOGOUT_SUCCESS,
    });
  } catch (e) {
    yield put({
      type: LOGOUT_FAILURE,
    });
    console.log(e);
  }
}

function* watchlogout() {
  console.log("watchLogoutUser");
  yield takeEvery(LOGOUT_REQUEST, logout);
}

export default function* authSaga() {
  yield all([fork(watchLoginUser), fork(watchlogout)]);
}
