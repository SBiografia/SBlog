import {
  CLEAR_ERROR_FAILURE,
  CLEAR_ERROR_REQUEST,
  CLEAR_ERROR_SUCCESS,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE,
} from "../types";
//store.js 에 있는 것과 initialState와 동일한 이름이어야 함.
const initialState = {
  //backend에서 만들어준 token
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  isLoading: false,
  user: "",
  userID: "",
  userName: "",
  userRole: "",
  errorMsg: "",
  successMsg: "",
};

const authReducer = (state = initialState, action) => {
  // 기존 state를 ... 인 얕은 복사로 가져오는 것은 react는 기존 state에서 복사해와서 그 다음에 변화시키고 싶은 상태값을 적어주는 것이므로
  switch (action.type) {
    case LOGOUT_REQUEST:
    case LOGIN_REQUEST:
      return {
        ...state,
        errorMsg: "",
        isLoading: true,
      };
    case LOGIN_SUCCESS:
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        isLoading: false,
        userId: action.payload.user.id,
        userRole: action.payload.user.role,
        errorMsg: "",
      };
    case LOGOUT_SUCCESS:
      localStorage.removeItem("token");
      return {
        token: null,
        user: null,
        userId: null,
        isAuthenticated: false,
        isLoading: false,
        userRole: null,
        errorMsg: "",
      };
    case LOGOUT_FAILURE:
    case LOGIN_FAILURE:
      localStorage.removeItem("token");
      return {
        ...state,
        ...action.payload,
        toekn: null,
        user: null,
        userId: null,
        userRole: null,
        isAuthenticated: false,
        isLoading: false,
        errorMsg: action.payload.data.msg,
      };
    case CLEAR_ERROR_REQUEST:
      return {
        ...state,
        errorMsg: null,
      };
    case CLEAR_ERROR_SUCCESS:
      return {
        ...state,
        errorMsg: null,
      };
    case CLEAR_ERROR_FAILURE:
      return {
        ...state,
        errorMsg: null,
      };

    default:
      return state;
  }
};

export default authReducer;
