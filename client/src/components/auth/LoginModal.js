import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  NavLink,
  Modal,
  ModalHeader,
  ModalBody,
  Alert,
  Form,
  Label,
  Input,
  Button,
} from "reactstrap";
import { CLEAR_ERROR_REQUEST, LOGIN_REQUEST } from "../../redux/types";
import {} from "reactstrap";

const LoginModal = () => {
  const [modal, setModal] = useState(false);
  const [localMsg, setLocalMsg] = useState("");
  const [form, setValues] = useState({
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const { errorMsg } = useSelector((state) => state.auth);
  useEffect(() => {
    try {
      setLocalMsg(errorMsg);
    } catch (e) {
      console.log(e);
    }
  }, [errorMsg]);

  const handleToggle = () => {
    dispatch({
      type: CLEAR_ERROR_REQUEST,
    });
    setModal(!modal);
  };

  const onChange = (e) => {
    setValues({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const { email, password } = form;
    const user = { email, password };
    console.log(user);
    //authSaga.js 의 loginUser 함수에서 action.payload 와 아래 넘겨주는 값의 변수명이 동일해야함.
    dispatch({
      type: LOGIN_REQUEST,
      payload: user,
    });
  };
  return (
    <div>
      <NavLink onClick={handleToggle} href="#">
        Login
      </NavLink>
      <Modal isOpen={modal} toggle={handleToggle}>
        <ModalHeader toggle={handleToggle}>Login</ModalHeader>
        <ModalBody>
          {localMsg ? <Alert color="danger">{localMsg}</Alert> : null}
          <Form on onSubmit={onSubmit}>
            <Label for="email">Email</Label>
            <Input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              onChange={onChange}
            ></Input>
            <Label for="password">Password</Label>
            <Input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              onChange={onChange}
            ></Input>
            <Button color="dark" style={{ marginTop: "2rem" }} block>
              Login
            </Button>
          </Form>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default LoginModal;
