import axios from "axios";
import { useEffect, useState } from "react";
import { useAuthContext } from "./AtuhContext";
import "./AllCommentUser.css"; // Import CSS file
import { Link } from "react-router-dom";

const AllCommentUser = () => {
  const [comments, setComments] = useState([]);
  const { authUser, setAuthUser } = useAuthContext();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/users/${authUser._id}/allComment`
        );
        console.log("Check response comment", response);
        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [authUser._id]);

  return (
    <div className="all-comment-user-container">
      <h2 className="comment-heading">All Comments by User</h2>
      <div className="comment-list">
        {comments.map((comment) => (
          <div key={comment._id} className="comment-item">
            <div className="comment-content">
              <p className="comment-text">{comment.comment}</p>
              {comment.photo && (
                <Link to={`photo/${comment.photo._id}`}>
                  <img
                    className="comment-thumbnail"
                    src={comment.photo.img}
                    alt="Post Thumbnail"
                  />
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllCommentUser;
