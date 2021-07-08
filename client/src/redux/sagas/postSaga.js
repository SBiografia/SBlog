import axios from "axios";
import {
  POST_DETAIL_LOADING_FAILURE,
  POST_DETAIL_LOADING_REQUEST,
  POST_DETAIL_LOADING_SUCCESS,
  POST_LOADING_FAILURE,
  POST_LOADING_REQUEST,
  POST_LOADING_SUCCESS,
  POST_UPLOADING_FAILURE,
  POST_UPLOADING_REQUEST,
  POST_UPLOADING_SUCCESS,
  POST_DELETE_REQUEST,
  POST_DELETE_FAILURE,
  POST_DELETE_SUCCESS,
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
    // console.log(result, "loadPosts");
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
    yield put(push("/"));
  }
}

function* watchUploadPost() {
  // console.log("postSaga.js/watchUploadPost Start");
  yield takeEvery(POST_UPLOADING_REQUEST, uploadPost);
}

//Post Detail
const loadPostDetailAPI = (payload) => {
  //Post Detail을 가져올때는 토큰이 필요 없음. 일반적인 사람들도 내용을 볼 수 있어야 하므로.
  // console.log(payload);
  return axios.get(`/api/post/${payload}`);
};

function* loadPostDetail(action) {
  // console.log("postSaga.js/loadPostDetail Start");
  try {
    const result = yield call(loadPostDetailAPI, action.payload);
    // console.log(result, "loadPostDetail => result");
    // console.log(action, "loadPostDetail => action");
    yield put({
      type: POST_DETAIL_LOADING_SUCCESS,
      payload: result.data,
    });
  } catch (e) {
    console.log("loadPostDetail error", e);
    yield put({
      type: POST_DETAIL_LOADING_FAILURE,
      payload: e,
    });
    yield put(push("/"));
  }
}

function* watchLoadPostDetail() {
  // console.log("postSaga.js/watchLoadPostDetail Start");
  yield takeEvery(POST_DETAIL_LOADING_REQUEST, loadPostDetail);
}

//Post Delete
const deletePostAPI = (payload) => {
  //지우는 작업은 글 쓴 사람만 지울 수 있어야 함.
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const token = payload.token;
  if (token) {
    config.headers["x-auth-token"] = token;
  }
  return axios.delete(`/api/post/${payload.id}`, config);
};

function* deletePost(action) {
  try {
    const result = yield call(deletePostAPI, action.payload);
    console.log("delete Post 1", result);
    yield put({
      type: POST_DELETE_SUCCESS,
      payload: result.data,
    });
    console.log("delete Post 2");
    yield put(push("/"));
  } catch (e) {
    console.log("delete error", e);
    yield put({
      type: POST_DELETE_FAILURE,
      payload: e,
    });
  }
}

function* watchDeletePost() {
  // console.log("postSaga.js/watchdeletePost Start");
  yield takeEvery(POST_DELETE_REQUEST, deletePost);
}

export default function* postSaga() {
  yield all([
    fork(watchLoadPosts),
    fork(watchUploadPost),
    fork(watchLoadPostDetail),
    fork(watchDeletePost),
  ]);
}
