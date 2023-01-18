import React, { useState, useRef, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useParams } from "react-router-dom";

const PostForm = function (props) {
  const editorRef = useRef(null);
  const [title, setTitle] = useState(null);
  const [text, setText] = useState(null);
  const [publish, setPublish] = useState(false);
  const postID = useParams().postid;
  const [busy, setBusy] = useState(postID ? true : false);

  function submitButtonHandler(event) {
    event.preventDefault();
    console.log(`title: ${title}`);
    console.log(`text: ${text}`);
    console.log(`publish?: ${publish}`);
  }

  async function setPostData(title, text, publishStatus) {
    setTitle(title);
    setText(text);
    setPublish(publishStatus);
    return;
  }

  //get post
  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("token");
      try {
        const postData = await fetch(
          `${process.env.REACT_APP_BLOG_API_URL}/private/posts/${postID}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );

        if (postData.status === 404) {
          console.log("No post with that ID was found.");
          return;
        }
        const postJSON = await postData.json();
        const post = postJSON.post;
        await setPostData(post.title, post.text, post.published);
        setBusy(false);
      } catch (err) {
        console.log(err);
        return;
      }
    }
    try {
      fetchData();
    } catch (err) {
      console.log(err);
    }
  }, [postID]);

  return busy ? (
    <div>
      <p>Loading...</p>
    </div>
  ) : (
    <div className="PostFormWrapper">
      <form className="PostForm">
        <div className="PostFormInputGroup">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            onChange={(event) => setTitle(event.target.value)}
            placeholder="My Blog Title"
            value={title}
          />
        </div>
        <div className="PostFormInputGroup tinyMCE">
          <label htmlFor="text">Text</label>
          {/** the tinyMCE text editor */}
          <Editor
            onInit={(evt, editor) => (editorRef.current = editor)}
            apiKey={process.env.REACT_APP_TINYMCE_API_KEY}
            initialValue={text}
            onEditorChange={(newValue, editor) => setText(newValue)}
            init={{
              height: 500,
              menubar: false,
              plugins: [
                "advlist autolink lists link image charmap print preview anchor",
                "searchreplace visualblocks code fullscreen",
                "insertdatetime media table paste code help wordcount",
              ],
              toolbar:
                "undo redo | formatselect | " +
                "bold italic backcolor | alignleft aligncenter " +
                "alignright alignjustify | bullist numlist outdent indent | " +
                "removeformat | help",
              content_style:
                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            }}
          />
        </div>

        <div className="PostFormInputGroup">
          <legend>Publish</legend>
          <div class="PostFormPublishRadios flexRow">
            <div className="PostFormPublishRadio flexRow">
              <label htmlFor="publish">Yes</label>
              <input
                type="radio"
                id="publish"
                name="published"
                value={true}
                onChange={(event) => setPublish(event.target.value)}
                checked={publish ? true : false}
              />
            </div>
            <div className="PostFormPublishRadio flexRow">
              <label htmlFor="unpublish">No</label>
              <input
                type="radio"
                id="unpublish"
                name="published"
                value={false}
                onChange={(event) => setPublish(event.target.value)}
                checked={publish ? false : true}
              />
            </div>
          </div>
        </div>

        <button onClick={(event) => submitButtonHandler(event)}>Submit</button>
      </form>
    </div>
  );
};

export default PostForm;
