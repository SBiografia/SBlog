import React, { useEffect, Fragment, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import {
  POST_LOADING_REQUEST,
  POST_LOADING_REQUEST_FIRST,
} from "../../redux/types";
import { GrowingSpinner } from "../../components/spinner/Spinner";
import { Row, Alert, Button } from "reactstrap";
import PostCardOne from "../../components/post/PostCardOne";
import Category from "../../components/post/Category";

let prevInterSectingRect = 0;
const PostCardList = () => {
  const { post, categoryFindResult, loading, postCount } = useSelector(
    (state) => state.post
  );
  const dispatch = useDispatch();
  //option (TRUE)= infinite Scroll, option(FALSE) = button
  const infiniteScrollOption = true;

  // console.log("dispatch", dispatch);
  // console.log(post);
  useEffect(() => {
    dispatch({ type: POST_LOADING_REQUEST_FIRST, payload: 0 });
  }, [dispatch]);

  //infinite Scroll : 처음에  0값 넘겨주고 그 후 request하면 postCount값에서 6개를 빼서 넘겨주고, 6개를 넘겨주고 하는 방식, 남은 숫자가 있을때까지 반복.
  //전 생애주기에서 유일하게 살아남는 값 = useRef = 0
  const skipNumberRef = useRef(0);
  const postCountRef = useRef(0);
  const endMsg = useRef(false);
  const [endCheck, setEndCheck] = useState(false);

  //처음에 postCount 값을 받아오기 전에 isintersecting이 감지되도 dispatch 방지하기 위한 부분
  if (postCount > 0) {
    postCountRef.current = postCount - 6;
  }

  /////////////////////////////////////////////
  //버튼 형식으로 Post 가져오기
  const readMorePost = () => {
    let remainPostCount = postCountRef.current - skipNumberRef.current;
    if (remainPostCount >= 0) {
      dispatch({
        type: POST_LOADING_REQUEST,
        payload: skipNumberRef.current + 6,
      });
      skipNumberRef.current += 6;
    } else {
      setEndCheck(true);
    }
  };

  const getPostByButton = (
    <Fragment>
      {loading ? (
        <div>{GrowingSpinner}</div>
      ) : endCheck ? (
        <div>
          <Alert color="danger" className="text-center font-weight-bolder">
            더 이상의 포스트는 없습니다.
          </Alert>
        </div>
      ) : (
        <div className="d-grid gap-2 mb-3 col-6 mx-auto">
          <Button
            block
            size="lg"
            className="text-center justify-content-center"
            onClick={readMorePost}
          >
            + 더 보기
          </Button>
        </div>
      )}
    </Fragment>
  );

  //Infinite Scroll 방식
  const getPostByInfinite = (
    /* 6개의 포스트를 읽은 후 div 1픽셀에서 lastPostElementRef 감지를 해서, 그게 loading값이면 GrowingSpiner가 나옴 */
    /* loading이 끝났는데 endMsg가 존재한다면, endMsg출력 */
    <Fragment>
      {loading ? (
        <div>{GrowingSpinner}</div>
      ) : endCheck ? (
        <div>
          <Alert color="danger" className="text-center font-weight-bolder">
            더 이상의 포스트는 없습니다.
          </Alert>
        </div>
      ) : (
        ""
      )}
    </Fragment>
  );

  const useOnScreen = (options) => {
    const lastPostElementRef = useRef();

    useEffect(() => {
      //observer를 달아줌. InterserctionObserver란 임계값(threshold)이 바뀌게 되면 인터섹션옵저버 객체의 콜백함수를 실행
      //여기 프로젝트에서는 lastPostElementRef 값을 달아놓은 div 값이 안보이다가 임계값만큼 변하게 되면 실행되는 것임.
      // 익스플로러에서는 인터섹션 옵저버 방식이 안먹힘..바벨로도 안됨...
      const observer = new IntersectionObserver(([entry]) => {
        //처음에 postCount 값을 받아오기 전에 isintersecting이 감지되버리면 postCount=0인 상태에서 remain이 -값이 되어서 endMsg=True가 됨.
        //처음에 loading을 하면서 감지되어서 여러번 REQ를 dispatch하는 것 방지를 위해서
        //prevInterSectionRect.y 값을 비교해서 동일한 위치에서 감지되면 if문 안넘어가도록 해줬음.
        if (
          postCount > 0 &&
          entry.isIntersecting &&
          prevInterSectingRect !== entry.intersectionRect.y
        ) {
          prevInterSectingRect = entry.intersectionRect.y;
          let remainPostCount = postCountRef.current - skipNumberRef.current;
          if (remainPostCount >= 0) {
            dispatch({
              type: POST_LOADING_REQUEST,
              payload: skipNumberRef.current + 6,
            });
            skipNumberRef.current += 6;
          } else {
            endMsg.current = true;
            setEndCheck(true);
          }
        }
      }, options);
      //lastPostElementRef값이 달려있으면 observer에 달아주는데,
      if (lastPostElementRef.current) {
        observer.observe(lastPostElementRef.current);
      }
      //달아주고 observer실행되고 나서 useEffect 끝나면 바로 끊어주는 작업을 함.
      const LastElememntReturnFunc = () => {
        if (lastPostElementRef.current) {
          observer.unobserve(lastPostElementRef.current);
          // observer.disconnect(lastPostElementRef.current);
        }
      };

      return LastElememntReturnFunc;
    }, [lastPostElementRef, options]);
    return [lastPostElementRef];
  };

  //임계값을 달아주는 이유는 화면 배율에 따라서 처음부터 6개가 다보여도 화면이 남을 수가 있음.
  //그럴 경우에는 lastPostEleRef 를 달아준 <div> 자체의 변화가 없기 때문에 처음부터 마지막으로 판단할수가 있어서 적절한 임계값을 찾아서 넣어주는 것임.
  //상세내용은 : https://developer.mozilla.org/ko/docs/Web/API/IntersectionObserver/IntersectionObserver
  //0.0~1.0 사이. 0.0:대상의 단일 픽셀이라도 보여지면, 대상이 보이는 것으로 계산. 1.0은 전체 대상 요소가 표시됨을 의미합니다
  const [lastPostElementRef] = useOnScreen({
    rootMargin: "0px",
    threshold: "0.9",
  });
  ///////////////////////////

  //PostCardList.js 와 PostCardOne.js 가 Container - Presenter 방식임
  //Container에는 값을 불러오는 것들을 작업을 하고, Presenter에 값을 넘겨주고, Presenter에서는 보여주는 작업을 함.
  return (
    <Fragment>
      <Helmet title="Home" />
      <Row className="border-bottom border-top border-primary py-2 mb-3">
        <Category post={categoryFindResult} />
      </Row>
      <Row>{post ? <PostCardOne post={post} /> : GrowingSpinner}</Row>
      {infiniteScrollOption ? getPostByInfinite : getPostByButton}

      <div ref={lastPostElementRef}></div>
      {/* className="bg-info border border-5 border-danger" */}
    </Fragment>
  );
};

export default PostCardList;
