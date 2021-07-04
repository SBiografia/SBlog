import axios from "axios";
import { all, fork, call, put, takeEvery } from "redux-saga/effects";

import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE,
  LOGOUT_REQUEST,
  USER_LOADING_FAILURE,
  USER_LOADING_REQUEST,
  USER_LOADING_SUCCESS,
  REGISTER_FAILURE,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  CLEAR_ERROR_FAILURE,
  CLEAR_ERROR_SUCCESS,
  CLEAR_ERROR_REQUEST,
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
  yield takeEvery(LOGOUT_REQUEST, logout);
}

//USER Loading
const userLoadingAPI = (token) => {
  // console.log("client/redux/sagas/authSaga.js => userLoadingAPI =>", token);
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  if (token) {
    config.headers["x-auth-token"] = token;
  }
  return axios.get("api/login/user", config);
};

function* userLoading(action) {
  try {
    // console.log("client/redux/sagas/authSaga.js => userLoading => action",  action  );
    const result = yield call(userLoadingAPI, action.payload);
    console.log(
      "client/redux/sagas/authSaga.js => userLoading => result",
      result
    );
    yield put({
      type: USER_LOADING_SUCCESS,
      payload: result.data,
    });
  } catch (e) {
    yield put({
      type: USER_LOADING_FAILURE,
      payload: e.response,
    });
  }
}

function* watchuserLoading() {
  yield takeEvery(USER_LOADING_REQUEST, userLoading);
}

//REGISTER
const registerUserAPI = (req) => {
  console.log(req, "req");
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  return axios.post("api/user", req, config);
};

function* registerUser(loginAction) {
  try {
    const result = yield call(registerUserAPI, loginAction.payload);
    console.log("RegisterUser Data", result);
    yield put({
      type: REGISTER_SUCCESS,
      payload: result.data,
    });
  } catch (e) {
    yield put({
      type: REGISTER_FAILURE,
      payload: e.response,
    });
  }
}

function* watchRegisterUser() {
  yield takeEvery(REGISTER_REQUEST, registerUser);
}

//CLEAR ERROR

function* clearError() {
  try {
    yield put({
      type: CLEAR_ERROR_SUCCESS,
    });
  } catch (e) {
    yield put({
      type: CLEAR_ERROR_FAILURE,
    });
  }
}

function* watchclearError() {
  yield takeEvery(CLEAR_ERROR_REQUEST, clearError);
}

export default function* authSaga() {
  yield all([
    fork(watchLoginUser),
    fork(watchlogout),
    fork(watchuserLoading),
    fork(watchRegisterUser),
    fork(watchclearError),
  ]);
}
