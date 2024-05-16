const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  comment: String,
  // The date and time when the comment was created.
  date_time: { type: Date, default: Date.now },
  // The ID of the user who created the comment.
  user_id: mongoose.Schema.Types.ObjectId,
});

const commentModel = mongoose.model("Comment", commentSchema);

module.exports = commentModel;
