import React, { useState, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

const NewPost = function (props) {
  const editorRef = useRef(null);
  return (
    <div className="newPostWrapper">
      <form className="newPostForm">
        <div className="newPostInputGroup">
          <label htmlFor="title">Title</label>
          <input type="text" name="title" id="title" />
        </div>
        <div className="newPostInputGroup">
          <label htmlFor="text">Text</label>
          <Editor
            onInit={(evt, editor) => (editorRef.current = editor)}
            initialValue="<p>This is the initial content of the editor.</p>"
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
      </form>
    </div>
  );
};

export default NewPost;
