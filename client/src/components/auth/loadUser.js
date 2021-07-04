import store from "../../store";
import { USER_LOADING_REQUEST } from "../../redux/types";

const loadUser = () => {
  try {
    // console.log("client/auth/loadUser.js => start");
    store.dispatch({
      type: USER_LOADING_REQUEST,
      payload: localStorage.getItem("token"),
    });
  } catch (e) {
    console.log("client/auth/loadUser.js =>", e);
  }
};

export default loadUser;
