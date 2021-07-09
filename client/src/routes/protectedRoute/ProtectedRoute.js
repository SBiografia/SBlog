import React, { Component } from "react";
import { useSelector } from "react-redux";
import { Route, Redirect } from "react-router-dom";

//edit 를 하는데 단순히 게시물 주소 뒤에 "~~~/edit"을 붙여서 접속 가능하다면 보안의 문제가 있으므로 protectedRoute를 해줌
//서버 쪽에서 auth 를 통해서 막아줄 수 있는데, 아래 방법은 Front에서 주소창을 이용한 접근을 막아줄 수 있는 방법임.
export const EditProtectedRoute = ({ component: Component, ...rest }) => {
  const { userId } = useSelector((state) => state.auth);
  const { creatorId } = useSelector((state) => state.post);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (userId === creatorId) {
          return <Component {...props} />;
        } else {
          return (
            <Redirect
              to={{
                pathname: "/",
                state: {
                  from: props.location,
                },
              }}
            />
          );
        }
      }}
    />
  );
};
