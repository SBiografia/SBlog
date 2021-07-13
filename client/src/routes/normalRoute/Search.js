import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Row } from "reactstrap";
import { SEARCH_REQUEST } from "../../redux/types";
import PostCardOne from "../../components/post/PostCardOne";

const Search = () => {
  const dispatch = useDispatch();
  let { searchTerm } = useParams();
  const { searchResult } = useSelector((state) => state.post);
  console.log(searchResult);

  useEffect(() => {
    if (searchTerm) {
      dispatch({
        type: SEARCH_REQUEST,
        payload: searchTerm,
      });
    }
  }, [dispatch, searchTerm]);

  return (
    <div>
      <h1> 검색 결과 : "{searchTerm}"</h1>
      <Row>
        <PostCardOne post={searchResult} />
      </Row>
    </div>
  );
};

export default Search;
