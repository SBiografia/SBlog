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
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [form, setValues] = useState({
    title: "",
    contents: "",
    fileUrl: "",
    category: "",
  });
  const { postDetail } = useSelector((state) => state.post);
  const dispatch = useDispatch();

  // console.log(postDetail);
  let beforeCategoryString = "";
  const beforeCategoryArray = postDetail.category;
  for (let item of postDetail.category) {
    beforeCategoryString = beforeCategoryString + "#" + item.categoryName + " ";
  }
  // console.log("edit->beforeCategoryString:", beforeCategoryString);

  const onChange = (e) => {
    // console.log(form);
    // console.log(e.target, e.target.name, e.target.value);
    setValues({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (e) => {
    await e.preventDefault();
    //강의에서는 category 수정은 안한다고 지웠는데 나는 냅뒀음.
    const { title, contents, fileUrl, category } = form;
    const token = localStorage.getItem("token");
    const id = postDetail._id;
    const body = { title, contents, fileUrl, category, token, id };

    const regexSpace = /\s/gi;
    const regexSeperator = /\#/gi;
    // console.log(body.category);
    let cateArray = body.category
      .replace(regexSpace, "")
      .split(/(#[^\s#]+)/g)
      .filter(Boolean);

    cateArray.forEach((item, index, arrSelf) => {
      item = item.replace(regexSeperator, "").replace(regexSpace, "");
      arrSelf[index] = item;
    });

    body.category = cateArray.filter(Boolean);
    console.log(body);

    dispatch({
      type: POST_EDIT_UPLOADING_REQUEST,
      payload: body,
    });
  };

  //postDetail의 속성값들이 달라진다면 저장을 하라는 useEffect
  useEffect(() => {
    // console.log(postDetail);
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
    // console.log("editor_getDataFromCKEditor");
    // console.log("editor", editor);
    const data = editor.getData();
    // console.log(data);

    if (data && data.match("<img src=")) {
      const whereImg_start = data.indexOf("<img src=");
      console.log(whereImg_start);
      let whereImg_end = "";
      let ext_name_find = "";
      let result_Img_Url = "";
      const ext_name = ["jpeg", "png", "jpg", "gif", "bmp"];

      for (let i = 0; i < ext_name.length; i++) {
        if (data.match(ext_name[i])) {
          console.log(data.indexOf(`${ext_name[i]}`));
          ext_name_find = ext_name[i];
          whereImg_end = data.indexOf(`${ext_name[i]}`);
        }
      }
      console.log(ext_name_find);
      console.log(whereImg_end);

      if (ext_name_find === "jpeg") {
        result_Img_Url = data.substring(whereImg_start + 10, whereImg_end + 4);
      } else {
        result_Img_Url = data.substring(whereImg_start + 10, whereImg_end + 3);
      }
      console.log(result_Img_Url, "result_Img_Url");
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
