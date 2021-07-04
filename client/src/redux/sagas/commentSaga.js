import axios from "axios";
import { all, fork, call, put, takeEvery } from "redux-saga/effects";
import { push } from "connected-react-router";

import {
  COMMENT_LOADING_FAILURE,
  COMMENT_LOADING_REQUEST,
  COMMENT_LOADING_SUCCESS,
  COMMENT_UPLOADING_SUCCESS,
  COMMENT_UPLOADING_FAILURE,
  COMMENT_UPLOADING_REQUEST,
} from "../types";

///////////////
//Load Comment
///////////////
const loadCommentsAPI = (payload) => {
  console.log("loadCommentsAPI ID", payload);
  return axios.get(`/api/post/${payload}/comments`);
};

function* loadComments(action) {
  try {
    console.log("loadComments : start");
    const result = yield call(loadCommentsAPI, action.payload);
    console.log("loadComments: resut is", result);
    yield put({
      type: COMMENT_LOADING_SUCCESS,
      payload: result.data,
    });
  } catch (e) {
    console.log(e);
    yield put({
      type: COMMENT_LOADING_FAILURE,
      payload: e,
    });
    yield push("/");
  }
}

function* watchLoadComments() {
  console.log("watchLoadComments : start");
  yield takeEvery(COMMENT_LOADING_REQUEST, loadComments);
}

///////////////
//Upload Comment
///////////////
const uploadCommentsAPI = (payload) => {
  console.log("uploadCommentsAPI payload is", payload);
  console.log("uploadCommentsAPI ID:", payload.id);
  return axios.post(`/api/post/${payload.id}/comments`, payload);
};

function* uploadComments(action) {
  try {
    console.log("commentSaga/uploadComments : start");
    console.log("commentSaga/uploadComments : action?:", action);
    const result = yield call(uploadCommentsAPI, action.payload);
    console.log("uploadComment", result);
    yield put({
      type: COMMENT_UPLOADING_SUCCESS,
      payload: result.data,
    });
  } catch (e) {
    console.log(e);
    yield put({
      type: COMMENT_UPLOADING_FAILURE,
      payload: e,
    });
    yield push("/");
  }
}

function* watchUploadComments() {
  console.log("commentSaga/watchUploadComments : start");
  yield takeEvery(COMMENT_UPLOADING_REQUEST, uploadComments);
}

export default function* commentSaga() {
  yield all([fork(watchLoadComments), fork(watchUploadComments)]);
}
