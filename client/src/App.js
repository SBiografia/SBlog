import React, { useState } from "react";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import store, { history } from "./store";
import MyRouter from "./routes/Router";
import BannerIE from "./routes/BannerIE";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/custom.scss";
const App = () => {
  console.log("start");

  const [isIe, setIsIe] = useState(false);
  const isIE = () => {
    if (
      navigator.userAgent.indexOf("MSIE") != -1 ||
      !!document.documentMode == true
    ) {
      setIsIe(true);
    }
  };

  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        {isIE ? <BannerIE /> : <MyRouter />}
      </ConnectedRouter>
    </Provider>
  );
};

export default App;
