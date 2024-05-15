import React, { useEffect, useState, useContext } from "react";
import { AppBar, Toolbar, Typography, IconButton, Button } from "@mui/material";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import "./styles.css";
import models from "../../modelData/models";
import { useAuthContext } from "./../../AtuhContext";
import axios from "axios";

function TopBar() {
  const { userId } = useParams(); // Extract userId from URL
  const [appContext, setAppContext] = useState(""); // State to hold app context
  const location = useLocation();
  const { authUser, setAuthUser } = useAuthContext();
  const [user, setUser] = useState(null);

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
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data based on the current location
        const namePath = location.pathname.slice(0, 7);
        const userId = location.pathname.slice(7);

        const fullname = `${user?.first_name} ${user?.last_name}` || "User";

        if (location.pathname === "/") {
          setAppContext("Home");
        } else if (location.pathname.includes("/users/")) {
          setAppContext("Details of User");
        } else if (namePath === "/photos") {
          setAppContext("Photos of User");
        } else if (namePath === "/detail") {
          setAppContext("Detail of user");
        } else if (location.pathname.includes("/create-img")) {
          setAppContext("Create img");
        } else if (location.pathname.includes("/edit")) {
          setAppContext("Edit user");
        } else {
          setAppContext("");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [location]);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      localStorage.setItem("user", JSON.stringify(null));
      navigate("/login");
      setAuthUser(null);
      await axios.post("http://localhost:8000/admin/logout");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar className="toolbar">
        <Typography
          component={Link}
          to="/"
          variant="h6"
          color="inherit"
          className="app-context"
        >
          {appContext ? `${appContext}` : "Home"}
        </Typography>
        {/* Authenticated user - show logout button */}
        {authUser && (
          <Button component={Link} to="/create-img" color="inherit">
            {" "}
            Tạo ảnh
          </Button>
        )}
        {authUser && (
          <Button component={Link} to={`/edit/${authUser._id}`} color="inherit">
            Edit User
          </Button>
        )}

        <Typography color="inherit">
          {authUser
            ? `Xin chào ${authUser.first_name} ${authUser.last_name}`
            : " "}
        </Typography>

        {authUser ? (
          <Typography>
            <IconButton onClick={handleLogout} color="inherit">
              Logout
            </IconButton>
          </Typography>
        ) : (
          // Not authenticated - show login button
          <IconButton component={Link} to="/login" color="inherit">
            Login
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
