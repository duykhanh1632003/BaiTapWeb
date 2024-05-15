import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Typography, List, ListItem, ListItemText } from "@mui/material";
import models from "../../modelData/models";
import "./styles.css"; // Import CSS file for styling
import axios from "axios";
import { useAuthContext } from "../../AtuhContext";

function UserList() {
  const { userId } = useParams();

  const { authUser, setAuthUser } = useAuthContext();
  const [data, setData] = useState([]);
  const [count, setCount] = useState(null);
  const [countComment, setCountcomment] = useState(null);
  const [user, setUser] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/");
        setData(response.data.users);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData(); // Gọi hàm fetchData trong useEffect
  }, [2000]);
  useEffect(() => {
    const getCount = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/users/${authUser._id}/photoCount`
        );
        setCount(response.data.photoCount);
      } catch (error) {
        console.error(error);
      }
    };

    getCount(); // Gọi hàm getCount ngay từ ban đầu

    const intervalId = setInterval(() => {
      getCount(); // Gọi lại hàm getCount sau mỗi 2 giây
    }, 3000); // 2000 milliseconds = 2 seconds

    // Trả về một hàm từ useEffect để dọn dẹp interval khi component unmount
    return () => clearInterval(intervalId);
  }, []); // Tham số thứ hai rỗng đảm bảo hàm này chỉ chạy một lần sau khi mount component

  useEffect(() => {
    const getCountComment = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/users/${authUser._id}/countComment`
        );
        setCountcomment(response.data.commentCount);
      } catch (error) {
        console.error(error);
      }
    };

    getCountComment(); // Gọi hàm getCountComment ngay từ ban đầu

    const intervalId = setInterval(() => {
      getCountComment(); // Gọi lại hàm getCountComment sau mỗi 2 giây
    }, 3000); // 2000 milliseconds = 2 seconds

    // Trả về một hàm từ useEffect để dọn dẹp interval khi component unmount
    return () => clearInterval(intervalId);
  }, []); // Tham số thứ hai rỗng đảm bảo hàm này chỉ chạy một lần sau khi mount component

  useEffect(() => {
    const getInf = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/users/${authUser._id}`
        );
        console.log("Cek response", response.data);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    getInf();
    const intervalId = setInterval(() => {
      getInf();
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);
  return (
    <div className="user-list-container">
      {" "}
      {/* Added container class */}
      <Typography variant="h6" className="list-title">
        Thông tin của bạn
      </Typography>{" "}
      <List className="list">
        <ListItem
          key={user?._id}
          component={Link}
          to={`/users/${user?._id}`}
          className="list-item"
        >
          <ListItemText
            primary={`${user?.first_name} ${user?.last_name}`}
            className="list-text"
          />{" "}
        </ListItem>
        <ListItem className="count-image">
          <ListItemText
            primary={`Bạn đã đăng: ${count} ảnh`}
            className="count-image"
          />{" "}
        </ListItem>
        <ListItem component={Link} to={`/detail`} className="count-comment">
          <ListItemText
            primary={`Số comment: ${countComment} comments`}
            className="count-comment"
          />{" "}
        </ListItem>
      </List>
      <Typography variant="h6" className="list-title">
        List bạn bè
      </Typography>{" "}
      <List className="list">
        {" "}
        {data.map((user) => (
          <ListItem
            key={user._id}
            component={Link}
            to={`/users/${user._id}`}
            className="list-item"
          >
            {" "}
            <ListItemText
              primary={`${user.first_name} ${user.last_name}`}
              className="list-text"
            />{" "}
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default UserList;
