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

const store = createStore(
  createRootReducer(history),
  initialState,
  composeEnhancer(applyMiddleware(...middlewares))
);

sagaMiddleware.run(rootSaga);

export default store;
