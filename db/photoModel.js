const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema({
  img: { type: String },
  // The date and time when the photo was added to the database.
  date_time: { type: Date, default: Date.now },
  // The ID of the user who created the photo.
  user_id: mongoose.Schema.Types.ObjectId,
  // Array of comment objects representing the comments made on this photo.
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
});

const photoModel = mongoose.model("Photo", photoSchema);

module.exports = photoModel;
