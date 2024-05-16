const commentModel = require("../db/commentModel");
const photoModel = require("../db/photoModel");

const newPhoto = async (req, res) => {
  try {
    const { img, user_id } = req.body;
    if (!img || !user_id) {
      res
        .status(400)
        .json({ errCode: 1, errMessage: "Not have img or userId" });
    }

    // Create a new photo instance
    const newPhoto = await photoModel.create({
      img,
      user_id,
    });

    // Save the new photo to the database
    const savedPhoto = await newPhoto.save();

    res.status(201).json(savedPhoto);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getPostByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find user photos and populate the comments field, including user info
    const userPhotos = await photoModel.find({ user_id: userId }).populate({
      path: "comments",
      populate: {
        path: "user_id",
        model: "User",
        select: "first_name last_name", // Only select first_name and last_name fields
      },
    });

    // Check if userPhotos is not an array, and convert it to an array if necessary
    const photosArray = Array.isArray(userPhotos) ? userPhotos : [userPhotos];

    // Send the response with the userPhotos array
    res.status(200).json(photosArray);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = getPostByUser;

module.exports = getPostByUser;

const postCommentByUser = async (req, res) => {
  try {
    const { photoId } = req.params;
    const { comment, user_id } = req.body;

    // Find the photo by photoId
    const photo = await photoModel.findById(photoId);

    if (!photo) {
      return res.status(404).json({ message: "Photo not found" });
    }

    // Create a new comment using the Comment model
    const newComment = await commentModel.create({
      comment,
      user_id,
    });

    // Add the ID of the new comment to the comments array of the photo
    photo.comments.push(newComment._id);

    // Save the updated photo to the database
    const updatedPhoto = await photo.save();

    res.status(201).json(updatedPhoto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getCountPhoto = async (req, res) => {
  try {
    const { userId } = req.params;

    const photoCount = await photoModel.countDocuments({ user_id: userId });

    // Trả về kết quả với số lượng ảnh đếm được
    res.status(200).json({ photoCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  newPhoto,
  getPostByUser,
  postCommentByUser,
  getCountPhoto,
};
