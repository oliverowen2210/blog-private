import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import format from "date-fns/format";

const Posts = function () {
  let [posts, setPosts] = useState(null);

  //get posts
  useEffect(() => {
    async function fetchData() {
      const postsData = await fetch(
        "https://blog-api-production-c97a.up.railway.app"
      );
      const posts = await postsData.json();
      setPosts(posts);
    }
    fetchData();
  }, []);

  return (
    <div>
      {posts ? (
        posts.map((post) => {
          const formattedDate = format(
            new Date(post.createdAt),
            "MMMM Qo, yyyy"
          );
          return (
            <Link to={`/post/${post.id}`}>
              <div className="post" key={post.id}>
                <div className="post-header">
                  <h2>{post.title}</h2>
                  <p>posted on {formattedDate}</p>
                </div>
                <p className="post-text">{post.text}</p>
                {post.published ? (
                  <p className="published">Published</p>
                ) : (
                  <p className="unpublished">Unpublished</p>
                )}
              </div>
            </Link>
          );
        })
      ) : (
        <div>
          <p>Loading...</p>
        </div>
      )}
    </div>
  );
};

export default Posts;
