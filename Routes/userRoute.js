const express = require("express");
const router = express.Router();
const userController = require("../Controllers/userController");

router.post("/admin/register", userController.registerUser);
router.post("/admin/login", userController.loginUser);
router.get("/find/:userId", userController.findUser);
router.get("/", userController.getUsers);
router.post("/admin/logout", userController.logoutUser);
router.get("/users", userController.getNumberPhotoComment);
router.get("/users/:userId/comments", userController.getAllCommentByUser);
router.get("/users/:userId/countComment", userController.getCountComment);
router.get("/users/:userId/allComment", userController.getAllCommentsByUser);
router.get("/users/:photoId/details", userController.getPhotoWithComments);
router.get("/users/:userId", userController.getUserById);
router.post("/users/:userId", userController.changeUser);
router.post("/users/:userId/change-password", userController.changePassword);

module.exports = router;
