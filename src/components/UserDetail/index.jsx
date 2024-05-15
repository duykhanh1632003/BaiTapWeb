import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Typography } from "@mui/material";
import models from "../../modelData/models";
import "./styles.css";
import axios from "axios";
function UserDetail() {
  const { userId } = useParams();
  const [data, setData] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/find/${userId}`
        );
        setData(response.data);
        console.log("check response detail", data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [userId]);

  if (!data) {
    return <Typography variant="body1">User not found.</Typography>;
  }

  return (
    <div className="user-detail-container">
      {" "}
      {/* Added container class */}
      <Typography variant="h6" className="detail-title">
        Thông tin người dùng
      </Typography>{" "}
      {/* Added class for title */}
      <div className="detail-info">
        {" "}
        {/* Added class for detail info */}
        <Typography variant="body1">
          <strong>Name:</strong> {data.first_name} {data.last_name}
        </Typography>
        <Typography variant="body1">
          <strong>Location:</strong> {data.location}
        </Typography>
        <Typography variant="body1">
          <strong>Description:</strong> {data.description}
        </Typography>
        <Typography variant="body1">
          <strong>Occupation:</strong> {data.occupation}
        </Typography>
        <Typography variant="body1">
          <Link to={`/photos/${userId}`} className="view-photos-link">
            Xem bài viết
          </Link>{" "}
          {/* Added class for link */}
        </Typography>
      </div>
    </div>
  );
}

export default UserDetail;
