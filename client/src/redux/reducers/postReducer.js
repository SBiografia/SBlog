/* eslint-disable import/no-anonymous-default-export */

import {
  POST_LOADING_SUCCESS,
  POST_LOADING_REQUEST,
  POST_LOADING_REQUEST_FIRST,
  POST_LOADING_FAILURE,
  POST_WRITE_REQUEST,
  POST_WRITE_SUCCESS,
  POST_WRITE_FAILURE,
  POST_UPLOADING_FAILURE,
  POST_UPLOADING_REQUEST,
  POST_UPLOADING_SUCCESS,
  POST_DETAIL_LOADING_REQUEST,
  POST_DETAIL_LOADING_FAILURE,
  POST_DETAIL_LOADING_SUCCESS,
  POST_EDIT_LOADING_SUCCESS,
  POST_EDIT_LOADING_FAILURE,
  POST_EDIT_LOADING_REQUEST,
  POST_EDIT_UPLOADING_FAILURE,
  POST_EDIT_UPLOADING_REQUEST,
  POST_EDIT_UPLOADING_SUCCESS,
  CATEGORY_FIND_FAILURE,
  CATEGORY_FIND_SUCCESS,
  CATEGORY_FIND_REQUEST,
  SEARCH_FAILURE,
  SEARCH_REQUEST,
  SEARCH_SUCCESS,
} from "../types";

const initialState = {
  //인증이 된 사람만 글을 쓸 수 있도록 하기 위함
  isAuthenticated: null,
  post: [],
  postDetail: "",
  //총 post의 개수 -> 추후 infinite scroll 구현을 위함.
  postCount: "",

  loading: false,
  error: "",
  creatorId: "",
  //추후 카테고리 검색 기능을 구현하기 위함
  categoryFindResult: "",
  title: "",
  //검색기능을 구현하기 위한 초기값
  searchBy: "",
  searchResult: "",
};

export default function (state = initialState, action) {
  switch (action.type) {
    case POST_LOADING_REQUEST_FIRST:
      console.log(state);
      return {
        //초기값 얕은 복사
        ...state,
        //최초로 불러올때는 Post를 다 날려줌
        post: [],
        loading: true,
      };
    case POST_LOADING_REQUEST:
      console.log(state);
      return {
        //초기값 얕은 복사
        ...state,
        //infinite를 안쓰면 post=[] 달아서 날려줘야 하는데, infinite scroll을 쓰게 되면 이 값을 없애줘야 계속 쌓이면서 보이게 됨
        // post: [],
        // post: state.post.length === 0 ? [] : [...state.post],
        loading: true,
      };
    case POST_LOADING_SUCCESS:
      return {
        //초기값 얕은 복사
        ...state,
        //...state.post 기존것이 있으면 가져오고, ...action.payload 우리가 새로 추가한 것을 추가해줌
        //순서를 바꿔주면 화면에 보여지는 정렬에 차이가 있음.(궁금하면 직접 해보기)
        post: [...state.post, ...action.payload.postFindResult],
        categoryFindResult: action.payload.categoryFindResult,
        postCount: action.payload.postCount,
        loading: false,
      };
    case POST_LOADING_FAILURE:
      console.log("POST_LOADING_FAILURE");
      return {
        //초기값 얕은 복사
        ...state,
        loading: false,
      };
    //WRITING은 언제 작성한거지.....ㄷㄷ 43강 듣는데 작성되어 있길래 부랴부랴 적음...
    case POST_WRITE_REQUEST:
      return {
        ...state,
        post: [],
        loading: true,
      };
    case POST_WRITE_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case POST_WRITE_FAILURE:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    //POST_UPLOADING
    case POST_UPLOADING_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case POST_UPLOADING_SUCCESS:
      console.log("POSTReducer->UPload", action.payload);
      return {
        ...state,
        posts: action.payload,
        isAuthenticated: true,
        loading: false,
      };
    case POST_UPLOADING_FAILURE:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    //POST LOADING DETAIL
    case POST_DETAIL_LOADING_REQUEST:
      return {
        ...state,
        post: [],
        loading: true,
      };
    case POST_DETAIL_LOADING_SUCCESS:
      // console.log("postReducer/switch/POST_DETAIL_LOADING_SUCCESS");
      // console.log("action", action);
      return {
        ...state,
        loading: false,
        postDetail: action.payload,
        creatorId: action.payload.creator._id,
        title: action.payload.title,
        category: action.payload.category,
      };
    case POST_DETAIL_LOADING_FAILURE:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    //POST EDIT_LOADING
    case POST_EDIT_LOADING_REQUEST:
      //...state 의미는 기존에 있는 상태 그대로 놔두겠다는 것.
      // post:[] 의미는 모든 post 불러들일 때 정보를 저장하는 배열
      return {
        ...state,
        post: [],
        loading: true,
      };
    case POST_EDIT_LOADING_SUCCESS:
      return {
        ...state,
        postDetail: action.payload,
        loading: false,
      };
    case POST_EDIT_LOADING_FAILURE:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    //POST EDIT_UPLOADING
    case POST_EDIT_UPLOADING_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case POST_EDIT_UPLOADING_SUCCESS:
      return {
        ...state,
        post: action.payload,
        isAuthenticated: true,
        loading: false,
      };
    case POST_EDIT_UPLOADING_FAILURE:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    //CATEGORY_FIND
    case CATEGORY_FIND_REQUEST:
      return {
        ...state,
        post: [],
        loading: true,
      };
    case CATEGORY_FIND_SUCCESS:
      console.log(action.payload);
      return {
        ...state,
        categoryFindResult: action.payload,
        loading: false,
      };
    case CATEGORY_FIND_FAILURE:
      return {
        ...state,
        categoryFindResult: action.payload,
        loading: false,
      };

    //SEARCH
    case SEARCH_REQUEST:
      return {
        ...state,
        post: [],
        searchBy: action.payload,
        loading: true,
      };
    case SEARCH_SUCCESS:
      return {
        ...state,
        searchResult: action.payload,
        searchBy: action.payload,
        loading: false,
      };
    case SEARCH_FAILURE:
      return {
        ...state,
        searchResult: action.payload,
        loading: false,
      };

    default:
      return state;
  }
}
