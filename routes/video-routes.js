const express = require("express");
const {
  addVideo,
  getAllVideos,
  updateVideo,
  deleteVideo,
} = require("../controllers/videoDataController");

// const multer = require("multer");

// const upload = multer({
//   storage: multer.memoryStorage(),
// });

const router = express.Router();

router.post("/add", addVideo);
router.get("/get", getAllVideos);
router.post("/update", updateVideo);
router.delete("/delete", deleteVideo);

module.exports = {
  routes: router,
};
