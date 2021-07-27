import React, { Fragment, useRef, useState } from "react";
import { Form, Input } from "reactstrap";
import { useDispatch } from "react-redux";
import { SEARCH_REQUEST } from "../../redux/types";

const SearchInput = () => {
  const dispatch = useDispatch();
  const [form, setValues] = useState({ searchBy: "" });
  const onChange = (e) => {
    setValues({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const onSubmit = async (e) => {
    await e.preventDefault();
    const { searchBy } = form;
    dispatch({
      type: SEARCH_REQUEST,
      payload: searchBy,
    });

    resetValue.current.value = "";
  };
  const resetValue = useRef(null);
  return (
    <Fragment>
      <Form onSubmit={onSubmit} className="col mx-5 mt-2">
        <Input name="searchBy" onChange={onChange} innerRef={resetValue} />
      </Form>
    </Fragment>
  );
};

export default SearchInput;
