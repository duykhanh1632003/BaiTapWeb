import "./App.css";

import React, { useContext } from "react";
import { Grid, Paper } from "@mui/material";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import Login from "./Login";
import { AuthContext } from "./AtuhContext";
import CreatePost from "./components/CreatePost";
import AllCommentUser from "./allCommentUser";
import DetailPhoto from "./Detail/DetailPhoto";
import EditUser from "./ChangeInf/ChangeUserInf";

const App = (props) => {
  const { authUser } = useContext(AuthContext);

  return (
    <div className="contain">
      <Router>
        <div className="top">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TopBar />
            </Grid>
            <div className="main-topbar-buffer" />
          </Grid>
        </div>
        {authUser ? (
          <div className="global-container">
            <Grid item sm={3}>
              <Paper className="main-grid-item">
                <UserList />
              </Paper>
            </Grid>
            <Paper className="">
              <Routes>
                {" "}
                <Route path="/users/:userId" element={<UserDetail />} />
                <Route path="/photos/:userId" element={<UserPhotos />} />
                <Route path="/create-img" element={<CreatePost />} />
                <Route path="/detail" element={<AllCommentUser />} />
                <Route path="/edit/:userId" element={<EditUser />} />
                <Route
                  path="/detail/photo/:photoId"
                  element={<DetailPhoto />}
                />
              </Routes>
            </Paper>
          </div>
        ) : (
          <Routes>
            <Route path="/login" element={<Login />} />
          </Routes>
        )}
      </Router>
    </div>
  );
};

export default App;
