import axios from "axios";
import {
  POST_LOADING_FAILURE,
  POST_LOADING_REQUEST,
  POST_LOADING_SUCCESS,
  POST_UPLOADING_FAILURE,
  POST_UPLOADING_REQUEST,
  POST_UPLOADING_SUCCESS,
} from "../types";
import { put, all, fork, call, takeEvery } from "redux-saga/effects";
import { push } from "connected-react-router";

//All Posts load
const loadPostAPI = () => {
  return axios.get("/api/post");
};

function* loadPosts() {
  try {
    const result = yield call(loadPostAPI);
    console.log(result, "loadPosts");
    yield put({
      type: POST_LOADING_SUCCESS,
      payload: result.data,
    });
  } catch (e) {
    yield put({
      type: POST_LOADING_FAILURE,
      payload: e,
    });
    yield push("/");
  }
}

function* watchLoadPosts() {
  yield takeEvery(POST_LOADING_REQUEST, loadPosts);
}

//Post Upload
const uploadPostAPI = (payload) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const token = payload.token;
  if (token) {
    config.headers["x-auth-token"] = token;
  }
  return axios.post("/api/post", payload, config);
};

function* uploadPost(action) {
  console.log("postSaga.js/uploadPost Start");
  try {
    const result = yield call(uploadPostAPI, action.payload);
    console.log(result, "uploadPost => result");
    console.log(action, "uploadPost => action");
    yield put({
      type: POST_UPLOADING_SUCCESS,
      payload: result.data,
    });
    yield put(push(`/post/${result.data._id}`));
  } catch (e) {
    yield put({
      type: POST_UPLOADING_FAILURE,
      payload: e,
    });
    yield push("/");
  }
}

function* watchUploadPost() {
  console.log("postSaga.js/watchUploadPost Start");
  yield takeEvery(POST_UPLOADING_REQUEST, uploadPost);
}

export default function* postSaga() {
  yield all([fork(watchLoadPosts), fork(watchUploadPost)]);
}
