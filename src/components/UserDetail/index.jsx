import React from "react";
import { useParams, Link } from "react-router-dom";
import { Typography } from "@mui/material";
import models from "../../modelData/models";
import "./styles.css";
function UserDetail() {
  const { userId } = useParams();
  const user = models.userModel(userId);

  if (!user) {
    return <Typography variant="body1">User not found.</Typography>;
  }

  return (
    <div className="user-detail-container">
      {" "}
      {/* Added container class */}
      <Typography variant="h6" className="detail-title">
        User Details:
      </Typography>{" "}
      {/* Added class for title */}
      <div className="detail-info">
        {" "}
        {/* Added class for detail info */}
        <Typography variant="body1">
          <strong>Name:</strong> {user.first_name} {user.last_name}
        </Typography>
        <Typography variant="body1">
          <strong>Location:</strong> {user.location}
        </Typography>
        <Typography variant="body1">
          <strong>Description:</strong> {user.description}
        </Typography>
        <Typography variant="body1">
          <strong>Occupation:</strong> {user.occupation}
        </Typography>
        <Typography variant="body1">
          <Link to={`/photos/${userId}`} className="view-photos-link">
            View Photos
          </Link>{" "}
          {/* Added class for link */}
        </Typography>
      </div>
    </div>
  );
}

export default UserDetail;
