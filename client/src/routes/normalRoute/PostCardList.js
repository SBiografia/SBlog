import React, { useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import { POST_LOADING_REQUEST } from "../../redux/types";
import { GrowingSpinner } from "../../components/spinner/Spinner";
import { Row } from "reactstrap";
import PostCardOne from "../../components/post/PostCardOne";

const PostCardList = () => {
  const { posts } = useSelector((state) => state.post);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: POST_LOADING_REQUEST });
  }, [dispatch]);

  //PostCardList.js 와 PostCardOne.js 가 Container - Presenter 방식임
  //Container에는 값을 불러오는 것들을 작업을 하고, Presenter에 값을 넘겨주고, Presenter에서는 보여주는 작업을 함.
  return (
    <Fragment>
      <Helmet title="Home" />
      <Row>{posts ? <PostCardOne posts={posts} /> : GrowingSpinner}</Row>
    </Fragment>
  );
};

export default PostCardList;
