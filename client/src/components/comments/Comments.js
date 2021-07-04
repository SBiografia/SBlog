import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import {
  COMMENT_UPLOADING_REQUEST,
  COMMENT_LOADING_REQUEST,
} from "../../redux/types";
import { Form, FormGroup, Row, Input, Button } from "reactstrap";
import { BlockQuote } from "@ckeditor/ckeditor5-block-quote/src/blockquote";

const Comments = ({ id, userName, userId }) => {
  const dispatch = useDispatch();
  const [form, setValues] = useState({ contents: "" });

  const onSubmit = async (e) => {
    await e.preventDefault();
    const { contents } = form;
    const token = localStorage.getItem("token");
    const body = {
      contents,
      token,
      id,
      userName,
      userId,
    };
    console.log(body);
    dispatch({
      type: COMMENT_UPLOADING_REQUEST,
      payload: body,
    });
    resetValue.current.value = "";
    setValues("");
  };
  const resetValue = useRef(null);

  const onChange = (e) => {
    setValues({
      ...form,
      [e.target.name]: e.target.value,
    });
    console.log("Comments.js/onChange:", form.contents);
  };

  useEffect(() => {
    dispatch({
      type: COMMENT_LOADING_REQUEST,
      payload: id,
    });
  }, [dispatch, id]);
  return (
    <>
      <Form onSubmit={onSubmit}>
        <FormGroup>
          <Row className="p-2">
            <div className="font-weight-bold m-1">Make Comment</div>
            <div className="my-1" />
            <Input
              innerRef={resetValue}
              type="textarea"
              name="contents"
              id="contents"
              onChange={onChange}
              placeholder="Comment"
            />
            <Button
              color="primary"
              Block
              className="mt-2 offset-md-10 col-md-2"
            >
              Submit
            </Button>
          </Row>
        </FormGroup>
      </Form>
    </>
  );
};

export default Comments;
