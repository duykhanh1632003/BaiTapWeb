import React, { useState } from "react";
import "./Login.css";
import * as Components from "./Components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "./AtuhContext";
import { toast } from "react-toastify";

const Login = () => {
  const [signIn, toggle] = useState(true);
  const { authUser, setAuthUser } = useAuthContext();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    location: "",
    description: "",
    occupation: "",
    email: "",
    password: "",
    confirmPassword: "", // Thêm trường confirmPassword
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (signIn) {
      try {
        const response = await axios.post(
          "http://localhost:8000/admin/login",
          formData // No need to stringify formData
        );

        if (response.status === 200 && response.data.errCode === 0) {
          // Store user data in localStorage
          const {
            _id,
            first_name,
            last_name,
            description,
            location,
            occupation,
          } = response.data;
          console.log("Check login", response.data);
          const userData = {
            _id,
            first_name,
            last_name,
            description,
            location,
            occupation,
          };

          localStorage.setItem("user", JSON.stringify(userData));
          setAuthUser(userData);
          toast.success("Đăng nhập thành công");
          navigate("/");
        } else {
          console.log("Error in response:", response.data);
        }
      } catch (error) {
        toast.error(
          "Đăng nhập không thành công bạn hãy kiểm tra lại thông tin"
        );

        console.error("Error:", error);
      }
    } else {
      // Kiểm tra mật khẩu nhập lại có khớp không
      if (formData.password !== formData.confirmPassword) {
        toast.error("Mật khẩu nhập lại không khớp");
        setFormData({
          first_name: "",
          last_name: "",
          location: "",
          description: "",
          occupation: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        return;
      }

      const data = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
        location: formData.location,
        occupation: formData.occupation,
        description: formData.description,
      };

      try {
        const response = await axios.post(
          "http://localhost:8000/admin/register",
          data // No need to stringify formData
        );

        if (response.status === 200 && response.data.errCode === 0) {
          // Store user data in localStorage
          const {
            _id,
            first_name,
            last_name,
            description,
            location,
            occupation,
          } = response.data;
          const userData = response.data;

          localStorage.setItem("user", JSON.stringify(userData));
          setAuthUser(userData);
          toast.success("Đăng ký thành công");

          navigate("/");
        } else {
          const errorFields = response.data.errorFields || [];
          const errorMessage =
            errorFields.join(", ") || "Thông tin không hợp lệ";
          toast.error(`Đăng ký không thành công: ${errorMessage}`);
          console.log("Error in response:", response.data);
          // Reset all input fields
          setFormData({
            first_name: "",
            last_name: "",
            location: "",
            description: "",
            occupation: "",
            email: "",
            password: "",
            confirmPassword: "",
          });
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <div className="container-login">
      <Components.Container>
        <Components.SignUpContainer signinIn={signIn}>
          <Components.Form onSubmit={handleSubmit}>
            <Components.Title>Create Account</Components.Title>
            <Components.Input
              type="text"
              name="first_name"
              placeholder="First Name"
              onChange={handleInputChange}
              value={formData.first_name}
            />
            <Components.Input
              type="text"
              name="last_name"
              placeholder="Last Name"
              onChange={handleInputChange}
              value={formData.last_name}
            />
            <Components.Input
              type="text"
              name="location"
              placeholder="Location"
              onChange={handleInputChange}
              value={formData.location}
            />
            <Components.Input
              type="text"
              name="description"
              placeholder="Description"
              onChange={handleInputChange}
              value={formData.description}
            />
            <Components.Input
              type="text"
              name="occupation"
              placeholder="Occupation"
              onChange={handleInputChange}
              value={formData.occupation}
            />
            <Components.Input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleInputChange}
              value={formData.email}
            />
            <Components.Input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleInputChange}
              value={formData.password}
            />
            <Components.Input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={handleInputChange}
              value={formData.confirmPassword}
            />
            <Components.Button type="submit">Sign Up</Components.Button>
          </Components.Form>
        </Components.SignUpContainer>

        <Components.SignInContainer signinIn={signIn}>
          <Components.Form onSubmit={handleSubmit}>
            <Components.Title>Sign in</Components.Title>
            <Components.Input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleInputChange}
              value={formData.email}
            />
            <Components.Input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleInputChange}
              value={formData.password}
            />
            <Components.Anchor href="#">
              Forgot your password?
            </Components.Anchor>
            <Components.Button type="submit">Sign In</Components.Button>
          </Components.Form>
        </Components.SignInContainer>

        <Components.OverlayContainer signinIn={signIn}>
          <Components.Overlay signinIn={signIn}>
            <Components.LeftOverlayPanel signinIn={signIn}>
              <Components.Title>Welcome Back!</Components.Title>
              <Components.Paragraph>
                To keep connected with us please login with your personal info
              </Components.Paragraph>
              <Components.GhostButton onClick={() => toggle(true)}>
                Sign In
              </Components.GhostButton>
            </Components.LeftOverlayPanel>

            <Components.RightOverlayPanel signinIn={signIn}>
              <Components.Title>Hello, Friend!</Components.Title>
              <Components.Paragraph>
                Enter Your personal details and start journey with us
              </Components.Paragraph>
              <Components.GhostButton onClick={() => toggle(false)}>
                Sign Up
              </Components.GhostButton>
            </Components.RightOverlayPanel>
          </Components.Overlay>
        </Components.OverlayContainer>
      </Components.Container>
    </div>
  );
};

export default Login;
