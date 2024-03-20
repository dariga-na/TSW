import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import App from "./App";
import Login from "./Login";
import reportWebVitals from "./reportWebVitals";

// ログイン状態を判定する変数。実際のアプリでは適切な方法で判定する必要があります。
const isLoggedIn = false;

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Route exact path="/">
        {isLoggedIn ? <Redirect to="/app" /> : <Login />}
      </Route>
      <Route path="/app">{isLoggedIn ? <App /> : <Redirect to="/" />}</Route>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
