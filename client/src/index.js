import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import loadUser from "./components/auth/loadUser";

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById("root")
// );

loadUser();

ReactDOM.render(<App />, document.getElementById("root"));
