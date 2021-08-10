import React from "react";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import store, { history } from "./store";
import MyRouter from "./routes/Router";
import BannerIE from "./routes/BannerIE";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/custom.scss";
const App = () => {
  const checkIE = () => {
    const userAgent = window.navigator.userAgent;
    console.log("start checkIE");
    if (userAgent.indexOf("Trident") > 0) {
      // alert("익스플로러에용");
      return true;
    } else if (/MSIE \d |Trident.*rv:/.test(userAgent)) {
      // alert("익스플로러에용");
      return true;
    } else {
      // alert("익스플로러 아니에요");
      return false;
    }
  };

  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        {checkIE() ? <BannerIE /> : <MyRouter />}
        {/* {<BannerIE />} */}
      </ConnectedRouter>
    </Provider>
  );
};

export default App;
