import React, { useState, useRef, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useParams, useNavigate } from "react-router-dom";

const PostForm = function (props) {
  const editorRef = useRef(null);
  const [title, setTitle] = useState(null);
  const [text, setText] = useState(null);
  const [published, setPublished] = useState(false);
  const postID = useParams().postid;
  const [busy, setBusy] = useState(postID ? true : false);

  const navigate = useNavigate();

  async function submitButtonHandler(event) {
    event.preventDefault();

    const token = localStorage.getItem("token");

    /** if there is a postID in the url, update that post*/
    if (postID) {
      try {
        await fetch(
          `${process.env.REACT_APP_BLOG_API_URL}/private/posts/${postID}`,
          {
            method: "PUT",
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title,
              text,
              published,
            }),
          }
        );
        navigate("/");
      } catch (err) {
        console.log(err);
      }
    } else {
      /**No postID, so create new post using the form values*/
      try {
        await fetch(`${process.env.REACT_APP_BLOG_API_URL}/private/posts/`, {
          method: "POST",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            text,
            published,
          }),
        });

        navigate("/");
      } catch (err) {
        console.log(err);
      }
    }
  }

  async function setPostData(title, text, publishStatus) {
    setTitle(title);
    setText(text);
    setPublished(publishStatus);
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
    <div className="postFormWrapper">
      <form className="postForm">
        <div className="postFormInputGroup">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            onChange={(event) => setTitle(event.target.value)}
            placeholder="My Blog Title"
            value={title ? title : ""}
          />
        </div>
        <div className="postFormInputGroup tinyMCE">
          <label htmlFor="text">Text</label>
          {/** the tinyMCE text editor */}
          <Editor
            onInit={(evt, editor) => (editorRef.current = editor)}
            apiKey={process.env.REACT_APP_TINYMCE_API_KEY}
            value={text ? text : ""}
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

        <div className="postFormInputGroup">
          <legend>Publish</legend>
          <div
            className="postFormPublishRadios flexRow"
            onChange={(event) => setPublished(event.target.value)}
          >
            <div className="postFormPublishRadio flexRow">
              <label htmlFor="published">Yes</label>
              <input
                type="radio"
                id="published"
                name="publish"
                value="publish"
                defaultChecked={published}
              />
            </div>
            <div className="postFormPublishRadio flexRow">
              <label htmlFor="unpublished">No</label>
              <input
                type="radio"
                id="unpublished"
                name="publish"
                value=""
                defaultChecked={!published}
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
