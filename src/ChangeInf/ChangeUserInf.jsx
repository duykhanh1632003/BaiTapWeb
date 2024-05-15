import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button } from "@mui/material";
import { useAuthContext } from "../AtuhContext";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const EditUser = () => {
  const { userId } = useParams();

  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    location: "",
    description: "",
    occupation: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/users/${userId}`
        );
        setUser(response.data);
        localStorage.setItem("user", JSON.stringify(response.data));
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await axios.post(`http://localhost:8000/users/${userId}`, user);
      toast.success("Đổi thông tin thành công");
      console.log("User information updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div>
      <h2>Edit User Information</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          name="first_name"
          label="First Name"
          value={user.first_name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="last_name"
          label="Last Name"
          value={user.last_name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="location"
          label="Location"
          value={user.location}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="description"
          label="Description"
          value={user.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="occupation"
          label="Occupation"
          value={user.occupation}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" type="submit">
          Save Changes
        </Button>
      </form>
    </div>
  );
};

export default EditUser;
