import {
  POST_LOADING_SUCCESS,
  POST_LOADING_REQUEST,
  POST_LOADING_FAILURE,
} from "../types";

const initialState = {
  //인증이 된 사람만 글을 쓸 수 있도록 하기 위함
  isAuthenticated: null,
  posts: [],
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
    case POST_LOADING_REQUEST:
      return {
        //초기값 얕은 복사
        ...state,
        posts: [],
        loading: true,
      };
    case POST_LOADING_SUCCESS:
      return {
        //초기값 얕은 복사
        ...state,
        //...state.posts 기존것이 있으면 가져오고, ...action.payload 우리가 새로 추가한 것을 추가해줌
        //순서를 바꿔주면 화면에 보여지는 정렬에 차이가 있음.(궁금하면 직접 해보기)
        posts: [...state.posts, ...action.payload],
        loading: false,
      };
    case POST_LOADING_FAILURE:
      return {
        //초기값 얕은 복사
        ...state,
        loading: false,
      };
    default:
      return state;
  }
}
