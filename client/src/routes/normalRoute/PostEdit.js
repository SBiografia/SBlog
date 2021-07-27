import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Col,
  Progress,
} from "reactstrap";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-editor-classic/src/classiceditor";
import { editorConfiguration } from "../../components/editor/EditorConfig";
//ballon???
import Myinit from "../../components/editor/UploadAdapter";
import { POST_EDIT_UPLOADING_REQUEST } from "../../redux/types";

const PostEdit = () => {
  console.log("helloDD");
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [form, setValues] = useState({
    title: "",
    contents: "",
    fileUrl: "",
    category: "",
  });
  const { postDetail } = useSelector((state) => state.post);
  const dispatch = useDispatch();
  console.log(postDetail.category);
  let beforeCategoryString = "";
  if (
    postDetail.category.length === 1 &&
    postDetail.category[0].categoryName === "미분류"
  ) {
    beforeCategoryString = "";
  } else {
    for (let item of postDetail.category) {
      beforeCategoryString =
        beforeCategoryString + "#" + item.categoryName + " ";
    }
  }
  const onChange = (e) => {
    setValues({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (e) => {
    await e.preventDefault();
    //강의에서는 category 수정은 안한다고 지웠는데 나는 냅뒀음.
    console.log(form);
    const { title, contents, fileUrl, category } = form;
    const token = localStorage.getItem("token");
    const id = postDetail._id;
    const body = { title, contents, fileUrl, category, token, id };
    console.log(body.category);
    const regexSpace = /\s/gi;
    // const regexSeperator = /\#/gi;
    const regexSeperator = /#/gi;
    let cateArray;

    if (Array.isArray(body.category)) {
      let tempCategory = "";
      for (let item of body.category) {
        tempCategory = tempCategory + "#" + item.categoryName + " ";
      }
      body.category = tempCategory;
    }

    if (
      body.category === null ||
      body.category === undefined ||
      body.category === "" ||
      body.category.length === 0
    ) {
      cateArray = ["미분류"];
    } else if (
      body.category.length === 1 &&
      body.category[0].categoryName === "미분류"
    ) {
      cateArray = ["미분류"];
    } else {
      cateArray = body.category
        .replace(regexSpace, "")
        .split(/(#[^\s#]+)/g)
        .filter(Boolean);
    }
    cateArray.forEach((item, index, arrSelf) => {
      item = item.replace(regexSeperator, "").replace(regexSpace, "");
      arrSelf[index] = item;
    });

    body.category = cateArray.filter(Boolean);

    dispatch({
      type: POST_EDIT_UPLOADING_REQUEST,
      payload: body,
    });
  };

  //postDetail의 속성값들이 달라진다면 저장을 하라는 useEffect
  useEffect(() => {
    setValues({
      title: postDetail.title,
      contents: postDetail.contents,
      fileUrl: postDetail.fileUrl,
      category: postDetail.category,
    });
  }, [
    postDetail,
    postDetail.title,
    postDetail.contents,
    postDetail.fileUrl,
    postDetail.category,
  ]);

  const getDataFromCKEditor = (event, editor) => {
    const data = editor.getData();

    if (data && data.match("<img src=")) {
      const whereImg_start = data.indexOf("<img src=");

      let whereImg_end = "";
      let ext_name_find = "";
      let result_Img_Url = "";
      const ext_name = ["jpeg", "png", "jpg", "gif", "bmp"];

      for (let i = 0; i < ext_name.length; i++) {
        if (data.match(ext_name[i])) {
          ext_name_find = ext_name[i];
          whereImg_end = data.indexOf(`${ext_name[i]}`);
        }
      }

      if (ext_name_find === "jpeg") {
        result_Img_Url = data.substring(whereImg_start + 10, whereImg_end + 4);
      } else {
        result_Img_Url = data.substring(whereImg_start + 10, whereImg_end + 3);
      }

      setValues({
        ...form,
        fileUrl: result_Img_Url,
        contents: data,
      });
    } else {
      setValues({
        ...form,
        // fileUrl: "https://source.unsplash.com/random/301x201",
        fileUrl: process.env.REACT_APP_BASIC_IMAGE_URL,
        contents: data,
      });
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <Form onSubmit={onSubmit}>
          <FormGroup className="mb-3">
            <Label for="title">Title</Label>
            <Input
              defaultValue={postDetail.title}
              type="text"
              name="title"
              id="title"
              className="form-control"
              onChange={onChange}
            />
          </FormGroup>
          <FormGroup className="mb-3">
            <Label for="category">Category</Label>
            <Input
              // defaultValue={postDetail.category.categoryName}
              defaultValue={beforeCategoryString}
              type="text"
              name="category"
              id="category"
              className="form-control"
              onChange={onChange}
            />
          </FormGroup>
          <FormGroup className="mb-3">
            <Label for="content">Content</Label>
            <CKEditor
              editor={ClassicEditor}
              config={editorConfiguration}
              data={postDetail.contents}
              onReady={Myinit}
              //글이 짧다면 onChange로 해도 되지만, onBlur 를 해주는게 실제 글을 작성하는데 있어서 좋음...
              //동작 방식은 찾아보기.
              onBlur={getDataFromCKEditor}
            />

            <Button
              color="success"
              block
              className="mt-3 col-md-2 offset-md-10 mb-3"
            >
              제출하기
            </Button>
          </FormGroup>
        </Form>
      ) : (
        <Col width={50} className="p-5 m-5">
          <Progress animated color="info" value={100} />
        </Col>
      )}
    </div>
  );
};

export default PostEdit;
