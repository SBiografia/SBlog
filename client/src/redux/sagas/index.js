import { all } from "redux-saga/effects";

//function* == generate 함수 : 여러 값을 반환할 수 있음(일반함수는 1개만 반환함)
export default function* rootSaga() {
  yield all([]);
}
