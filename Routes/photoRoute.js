const express = require("express");
const router = express.Router();
const photoController = require("../Controllers/photoController");

router.post("/photos/new", photoController.newPhoto);
router.get("/photos/user/:userId", photoController.getPostByUser);
router.post("/photos/:photoId/comments/new", photoController.postCommentByUser);
router.get("/users/:userId/photoCount", photoController.getCountPhoto);

module.exports = router;
