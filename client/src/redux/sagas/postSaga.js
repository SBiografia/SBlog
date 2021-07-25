import axios from "axios";
import {
  POST_DETAIL_LOADING_FAILURE,
  POST_DETAIL_LOADING_REQUEST,
  POST_DETAIL_LOADING_SUCCESS,
  POST_LOADING_FAILURE,
  POST_LOADING_REQUEST,
  POST_LOADING_REQUEST_FIRST,
  POST_LOADING_SUCCESS,
  POST_UPLOADING_FAILURE,
  POST_UPLOADING_REQUEST,
  POST_UPLOADING_SUCCESS,
  POST_DELETE_REQUEST,
  POST_DELETE_FAILURE,
  POST_DELETE_SUCCESS,
  POST_EDIT_LOADING_SUCCESS,
  POST_EDIT_LOADING_FAILURE,
  POST_EDIT_LOADING_REQUEST,
  POST_EDIT_UPLOADING_SUCCESS,
  POST_EDIT_UPLOADING_REQUEST,
  POST_EDIT_UPLOADING_FAILURE,
  CATEGORY_FIND_REQUEST,
  CATEGORY_FIND_SUCCESS,
  CATEGORY_FIND_FAILURE,
  SEARCH_FAILURE,
  SEARCH_REQUEST,
  SEARCH_SUCCESS,
} from "../types";
import { put, all, fork, call, takeEvery } from "redux-saga/effects";
import { push } from "connected-react-router";

//All Posts load
const loadPostAPI = (payload) => {
  // infinite scroll 적용하기 전 코드
  // return axios.get("/api/post");
  // infinite scroll 적용
  return axios.get(`/api/post/skip/${payload}`);
};

function* loadPosts(action) {
  try {
    const result = yield call(loadPostAPI, action.payload);
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
    // yield push("/");
  }
}

function* watchLoadPosts() {
  yield takeEvery(POST_LOADING_REQUEST, loadPosts);
}
function* watchLoadFirstPosts() {
  yield takeEvery(POST_LOADING_REQUEST_FIRST, loadPosts);
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
  try {
    const result = yield call(uploadPostAPI, action.payload);
    // console.log(action.payload, "uploadPost => action"); //postWrite에서 작성한 body 글 내용

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
    // console.log(action.payload);
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

//Post EDIT LOAD
const postEditLoadAPI = (payload) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const token = payload.token;
  if (token) {
    config.headers["x-auth-token"] = token;
  }
  return axios.get(`/api/post/${payload.id}/edit`, config);
};

function* postEditLoad(action) {
  try {
    const result = yield call(postEditLoadAPI, action.payload);
    yield put({
      type: POST_EDIT_LOADING_SUCCESS,
      payload: result.data,
    });
  } catch (e) {
    console.log("delete error", e);
    yield put({
      type: POST_EDIT_LOADING_FAILURE,
      payload: e,
    });
    yield put(push("/"));
  }
}

function* watchPostEditLoad() {
  yield takeEvery(POST_EDIT_LOADING_REQUEST, postEditLoad);
}

//Post EDIT UPLOAD
const postEditUploadAPI = (payload) => {
  console.log(payload);
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const token = payload.token;
  if (token) {
    config.headers["x-auth-token"] = token;
  }
  // console.log(config);
  //const token = payload.token 인데 payload가 앞에 있어야 token값을 가져올 수 있음
  return axios.post(`/api/post/${payload.id}/edit`, payload, config);
};

function* postEditUpload(action) {
  try {
    // console.log(action);
    const result = yield call(postEditUploadAPI, action.payload);
    // console.log("postSaga/PostEditUpload start", result);
    yield put({
      type: POST_EDIT_UPLOADING_SUCCESS,
      payload: result.data,
    });
    yield put(push(`/post/${result.data._id}`));
  } catch (e) {
    console.log("delete error", e);
    yield put({
      type: POST_EDIT_UPLOADING_FAILURE,
      payload: e,
    });
    yield put(push("/"));
  }
}

function* watchPostEditUpload() {
  // console.log("start watch post edit upload");
  yield takeEvery(POST_EDIT_UPLOADING_REQUEST, postEditUpload);
}

//Category Find
const categoryFindAPI = (payload) => {
  //encodeURIComponent : 영어가 아닌 문자들을 UTF-8로 인코딩해서 적어줌.
  return axios.get(`/api/post/category/${encodeURIComponent(payload)}`);
};

function* categoryFind(action) {
  try {
    // console.log("postSaga:categoryFind start");
    const result = yield call(categoryFindAPI, action.payload);
    // console.log(action.payload); //action.payload = categoryName
    console.log("postSaga:categoryFind", result);
    yield put({
      type: CATEGORY_FIND_SUCCESS,
      payload: result.data,
    });
  } catch (e) {
    yield put({
      type: CATEGORY_FIND_FAILURE,
      payload: e,
    });
  }
}

function* watchCategoryFind() {
  yield takeEvery(CATEGORY_FIND_REQUEST, categoryFind);
}

//SEARCH
const searchResultAPI = (payload) => {
  return axios.get(`/api/search/${encodeURIComponent(payload)}`);
};

function* searchResult(action) {
  try {
    const result = yield call(searchResultAPI, action.payload);
    yield put({
      type: SEARCH_SUCCESS,
      payload: result.data,
    });
    yield put(push(`/search/${encodeURIComponent(action.payload)}`));
  } catch (e) {
    yield put({
      type: SEARCH_FAILURE,
      payload: e,
    });
    yield put(push("/"));
  }
}

function* watchSearchResult() {
  yield takeEvery(SEARCH_REQUEST, searchResult);
}

export default function* postSaga() {
  yield all([
    fork(watchLoadPosts),
    fork(watchUploadPost),
    fork(watchLoadPostDetail),
    fork(watchDeletePost),
    fork(watchPostEditLoad),
    fork(watchPostEditUpload),
    fork(watchCategoryFind),
    fork(watchSearchResult),
    fork(watchLoadFirstPosts),
  ]);
}
