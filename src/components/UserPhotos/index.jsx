import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Typography } from "@mui/material";
import models from "../../modelData/models";
import "./styles.css";
function UserPhotos() {
  const { userId } = useParams();
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userPhotos = models.photoOfUserModel(userId);
        setPhotos(userPhotos);
      } catch (error) {
        console.error("Error fetching photos:", error);
      }
    };

    fetchData();
  }, [userId]);

  return (
    <div className="user-photos-container">
      <Typography variant="body1">User Photos:</Typography>
      {photos?.map((photo) => (
        <div className="photo-item" key={photo._id}>
          <img
            src={require(`./../../images/${photo.file_name}`)}
            alt={`Photo ${photo._id}`}
          />
          <div className="photo-info">
            <Typography variant="body1">
              Date/Time: {photo.date_time}
            </Typography>
            <Typography variant="body1">Comments:</Typography>
            {photo.comments ? (
              photo.comments.map((comment) => (
                <div className="comment-item" key={comment._id}>
                  <Typography variant="body1">{comment.date_time}</Typography>
                  <Typography variant="body1">
                    <Link to={`/users/${comment.user._id}`}>
                      {comment.user.first_name} {comment.user.last_name}
                    </Link>
                    : {comment.comment}
                  </Typography>
                </div>
              ))
            ) : (
              <Typography variant="body1">No comments yet.</Typography>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default UserPhotos;
