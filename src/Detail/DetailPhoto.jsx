import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./DetailPhoto.css";
import { useAuthContext } from "../AtuhContext";
import { TextField, Button } from "@mui/material";

const DetailPhoto = () => {
  const { photoId } = useParams();
  const [photoData, setPhotoData] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const { authUser } = useAuthContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/users/${photoId}/details`
        );
        setPhotoData(response.data.photo);
        const commentsWithUserData = response.data.comments.map(
          async (comment) => {
            const userResponse = await axios.get(
              `http://localhost:8000/users/${comment.user_id}`
            );
            return {
              ...comment,
              user: userResponse.data,
            };
          }
        );

        Promise.all(commentsWithUserData).then((commentsWithUser) => {
          setComments(commentsWithUser);
        });
      } catch (error) {
        console.error("Error fetching photo details:", error);
      }
    };

    fetchData();
  }, [photoId]);
  const handleCommentSubmit = async () => {
    try {
      await axios.post(`http://localhost:8000/photos/${photoId}/comments/new`, {
        comment: commentText,
        user_id: authUser._id,
      });
      setCommentText(""); // Clear comment text after submission
      // Refetch photos data to update with new comment
      const response = await axios.get(
        `http://localhost:8000/users/${photoId}/details`
      );
      setPhotoData(response.data.photo);
      const commentsWithUserData = response.data.comments.map(
        async (comment) => {
          const userResponse = await axios.get(
            `http://localhost:8000/users/${comment.user_id}`
          );
          return {
            ...comment,
            user: userResponse.data,
          };
        }
      );
      Promise.all(commentsWithUserData).then((commentsWithUser) => {
        setComments(commentsWithUser);
      });
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };
  return (
    <div className="detail-photo-container">
      {photoData && (
        <div className="photo-details">
          <img src={photoData.img} alt="Photo" />
          <div className="date-time">
            Date/Time: {new Date(photoData.date_time).toLocaleString()}
          </div>
        </div>
      )}
      <div className="comments">
        <h2>Comments</h2>
        {comments.map((comment) => (
          <div key={comment._id} className="comment-item">
            <p className="comment-info">
              Commented by: {comment.user.first_name} {comment.user.last_name}
              <span className="comment-time">
                {new Date(comment.date_time).toLocaleString()}
              </span>
            </p>
            <p>{comment.comment}</p>
          </div>
        ))}
        <div className="comment-item">
          <TextField
            label="Add a comment"
            variant="outlined"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleCommentSubmit()}
          >
            Comment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DetailPhoto;
