import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Typography, TextField, Button } from "@mui/material";
import axios from "axios";
import "./styles.css";
import { useAuthContext } from "../../AtuhContext";

function UserPhotos() {
  const { authUser } = useAuthContext();

  const { userId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commentPhotoId, setCommentPhotoId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/photos/user/${userId}`
        );
        if (response) {
          setPhotos(response.data);
        }
      } catch (error) {
        console.error("Error fetching photos:", error);
      }
    };

    fetchData();
  }, [userId]);

  const handleCommentSubmit = async (photoId) => {
    try {
      await axios.post(`http://localhost:8000/photos/${photoId}/comments/new`, {
        comment: commentText,
        user_id: authUser._id,
      });
      setCommentText(""); // Clear comment text after submission
      // Refetch photos data to update with new comment
      const response = await axios.get(
        `http://localhost:8000/photos/user/${userId}`
      );
      if (response) {
        setPhotos(response.data);
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const handleCommentInputFocus = (photoId) => {
    setCommentPhotoId(photoId);
  };

  return (
    <div className="user-photos-container">
      <div className="title">Bản tin</div>
      {photos && photos.length > 0 ? (
        photos.map((photo) => (
          <div className="photo-item" key={photo._id}>
            <img className="img" src={photo.img} alt="post" />
            <div className="photo-info">
              <div className="date-time-img">
                Date/Time: {new Date(photo.date_time).toLocaleString()}
              </div>
              <div className="comment">Comments:</div>
              {photo.comments && photo.comments.length > 0 ? (
                photo.comments.map((comment) => (
                  <div className="comment-item" key={comment._id}>
                    <div className="img-src">
                      <Link
                        className="img-src-title"
                        to={`/users/${comment.user_id._id}`}
                      >
                        {comment.user_id.first_name} {comment.user_id.last_name}
                      </Link>
                      : {comment.comment}
                    </div>
                    <div className="date-comment">
                      {new Date(comment.date_time).toLocaleString()}
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-comment">No comments yet.</div>
              )}
              {/* Comment Form */}
              <TextField
                label="Add a comment"
                variant="outlined"
                value={commentPhotoId === photo._id ? commentText : ""}
                onChange={(e) => setCommentText(e.target.value)}
                onFocus={() => handleCommentInputFocus(photo._id)}
                fullWidth
                margin="normal"
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleCommentSubmit(photo._id)}
              >
                Comment
              </Button>
            </div>
          </div>
        ))
      ) : (
        <Typography variant="body1">No photos found.</Typography>
      )}
    </div>
  );
}

export default UserPhotos;
