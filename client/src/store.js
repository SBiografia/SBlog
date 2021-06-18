import { createStore, compose, applyMiddleware } from "redux";
import createSagaMiddleware from "@redux-saga/core";
import { createBrowserHistory } from "history";
import { routerMiddleware } from "connected-react-router";

import createRootReducer from "./redux/reducers/index";
import rootSaga from "./redux/sagas";

export const history = createBrowserHistory();

const sagaMiddleware = createSagaMiddleware();

//만드는 WEB의 모든 상태 초기값
const initialState = {};

const middlewares = [sagaMiddleware, routerMiddleware(history)];
const devtools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;

//배포단계에서는 개발자도구를 안보이게 해준다...?
const composeEnhancer =
  process.env.NODE_ENV === "production" ? compose : devtools || compose;

//앱의 상태를 보관하는 Redux store
//여기서는 3가지 값을 가지고 있다.
//createRotReducer :
//initialState : 실제 앱의 모든 상태 초가깂
//composeEnhancer :
const store = createStore(
  createRootReducer(history),
  initialState,
  composeEnhancer(applyMiddleware(...middlewares))
);

sagaMiddleware.run(rootSaga);

export default store;
