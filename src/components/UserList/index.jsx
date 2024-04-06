import React from "react";
import { Link } from "react-router-dom";
import { Typography, List, ListItem, ListItemText } from "@mui/material";
import models from "../../modelData/models";
import "./styles.css"; // Import CSS file for styling

function UserList() {
  const users = models.userListModel();

  return (
    <div className="user-list-container">
      {" "}
      {/* Added container class */}
      <Typography variant="h6" className="list-title">
        User List:
      </Typography>{" "}
      {/* Added class for title */}
      <List className="list">
        {" "}
        {/* Added class for list */}
        {users.map((user) => (
          <ListItem
            key={user._id}
            component={Link}
            to={`/users/${user._id}`}
            className="list-item"
          >
            {" "}
            {/* Added class for list items */}
            <ListItemText
              primary={`${user.first_name} ${user.last_name}`}
              className="list-text"
            />{" "}
            {/* Added class for list text */}
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default UserList;
