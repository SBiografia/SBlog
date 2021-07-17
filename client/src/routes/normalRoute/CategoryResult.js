import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import PostCardOne from "../../components/post/PostCardOne";
import { CATEGORY_FIND_REQUEST } from "../../redux/types";
import { Row } from "reactstrap";

const CategoryResult = () => {
  const dispatch = useDispatch();
  let { categoryName } = useParams();
  const { categoryFindResult } = useSelector((state) => state.post);

  // console.log(categoryFindResult);
  // console.log(categoryName);

  useEffect(() => {
    dispatch({
      type: CATEGORY_FIND_REQUEST,
      payload: categoryName,
    });
  }, [dispatch, categoryName]);

  return (
    <div>
      <h1> Category : "{categoryName}"</h1>
      <Row>
        <PostCardOne post={categoryFindResult.post} />
      </Row>
    </div>
  );
};

export default CategoryResult;
