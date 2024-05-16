const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("validator");
const Photo = require("../db/photoModel");
const userModel = require("../db/userModel");
const commentModel = require("../db/commentModel");
const createToken = (_id) => {
  let jwtkey = process.env.JWT_SECRET_KEY;
  return jwt.sign({ _id }, jwtkey, { expiresIn: "3d" });
};

const registerUser = async (req, res) => {
  try {
    let {
      first_name,
      last_name,
      location,
      description,
      occupation,
      email,
      password,
    } = req.body;
    let user = await userModel.findOne({ email });
    console.log("chjeck body", req.body);
    if (user)
      return res.status(200).json({
        errCode: 1,
        errMessage: "User with the given email already exists",
      });
    if (!first_name || !last_name || !email || !password)
      return res
        .status(400)
        .json({ errCode: 1, errMessage: "All fields are required..." });

    if (!validator.isEmail(email))
      return res
        .status(200)
        .json({ errCode: 1, errMessage: "Email must be a valid email" });

    user = new userModel({
      first_name,
      last_name,
      location,
      description,
      occupation,
      email,
      password,
    });

    let salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    let token = createToken(user._id);

    // Set cookie with user information
    res.cookie("userData", JSON.stringify({ token }), { httpOnly: true });

    res
      .status(200)
      .json({ _id: user._id, first_name, last_name, email, token, errCode: 0 });
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await userModel.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ errCode: 1, errMessage: "Invalid Email or Password" });

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword)
      return res
        .status(200)
        .json({ errCode: 1, errMessage: "Invalid password" });

    let token = createToken(user._id);

    // Set cookie with user information
    res.cookie(
      "userData",
      JSON.stringify({
        token,
      }),
      { httpOnly: true }
    );

    res.status(200).json({
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email,
      location: user.location,
      description: user.description,
      occupation: user.occupation,
      token,
      errCode: 0,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};

const findUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        errCode: 1,
        errMessage: "User not found",
      });
    }
    res.status(200).json(user);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await userModel.find({}, "_id first_name last_name");
    res.status(200).json({
      users,
      errCode: 0,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      errCode: 1,
      errMessage: "Missing required parameter",
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    // Kiểm tra cookie để xác định người dùng đã đăng nhập hay chưa
    // if (req.cookies.userData) {
    //   // Xóa cookie để logout
    //   res.clearCookie("userData");
    //   res.status(200).json({ success: true, message: "Logout successful" });
    // } else {
    //   res.status(400).json({ success: false, message: "User not logged in" });
    // }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
const getNumberPhotoComment = async (req, res) => {
  try {
    // Find all users
    const users = await userModel.find();

    // Fetch photo count and comment count for each user
    const usersWithCounts = await Promise.all(
      users.map(async (user) => {
        const photoCount = await Photo.countDocuments({ user_id: user._id });
        const commentCount = await Photo.Comments.countDocuments({
          user_id: user._id,
        });
        return {
          _id: user._id,
          first_name: user.first_name,
          last_name: user.last_name,
          photoCount,
          commentCount,
        };
      })
    );

    res.status(200).json(usersWithCounts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllCommentByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find all comments by the given user ID
    const userComments = await Photo.Comments.find({
      user_id: userId,
    }).populate("photo_id");

    res.status(200).json(userComments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getCountComment = async (req, res) => {
  try {
    const { userId } = req.params;

    const commentCount = await commentModel.countDocuments({ user_id: userId });

    res.status(200).json({ commentCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllCommentsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const userComments = await commentModel.find({ user_id: userId });

    const commentsWithPhotos = await Promise.all(
      userComments.map(async (comment) => {
        const photo = await Photo.findOne({
          comments: { $in: [comment._id] },
        });
        return {
          _id: comment._id,
          comment: comment.comment,
          date_time: comment.date_time,
          user_id: comment.user_id,
          photo: photo || null,
        };
      })
    );

    res.status(200).json(commentsWithPhotos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getPhotoWithComments = async (req, res) => {
  try {
    const { photoId } = req.params;

    // Tìm thông tin về ảnh dựa trên photoId
    const photo = await Photo.findById(photoId);

    if (!photo) {
      return res.status(404).json({ message: "Photo not found" });
    }

    // Tìm tất cả các nhận xét của ảnh này
    const comments = await commentModel.find({ _id: { $in: photo.comments } });

    // Lặp qua mỗi nhận xét để thêm thông tin về người dùng
    for (let i = 0; i < comments.length; i++) {
      const user = await userModel.findById(comments[i].user_id);
      comments[i].user_id = user; // Thêm thông tin về người dùng vào nhận xét
    }

    // Trả về thông tin về ảnh cùng với tất cả các nhận xét
    res.status(200).json({ photo, comments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    // Tìm thông tin người dùng bằng userId
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Trả về thông tin người dùng
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const changeUser = async (req, res) => {
  const userId = req.params.userId;
  const { first_name, last_name, location, description, occupation } = req.body;

  try {
    // Find the user by ID
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update user information
    user.first_name = first_name || user.first_name;
    user.last_name = last_name || user.last_name;
    user.location = location || user.location;
    user.description = description || user.description;
    user.occupation = occupation || user.occupation;

    // Save the updated user
    await user.save();

    res.status(200).json({ message: "User information updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const changePassword = async (req, res) => {
  const { userId } = req.params;
  const { oldPassword, newPassword } = req.body;

  try {
    // Find the user by ID
    const user = await userModel.findById(userId);

    // Check if the old password matches the current password
    const isValidPassword = await bcrypt.compare(oldPassword, user.password);

    if (!isValidPassword) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password
    user.password = hashedPassword;

    // Save the updated user
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = {
  registerUser,
  createToken,
  loginUser,
  findUser,
  getUsers,
  logoutUser,
  getNumberPhotoComment,
  getAllCommentByUser,
  getCountComment,
  getAllCommentsByUser,
  getPhotoWithComments,
  getUserById,
  changeUser,
  changePassword
};
