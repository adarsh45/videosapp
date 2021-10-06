const firebase = require("../db");
const config = require("../config");
// const VideoData = require("../models/VideoData");
const firestore = firebase.firestore();
const { Storage } = require("@google-cloud/storage");
const formidable = require("formidable");
const path = require("path");
const { v4 } = require("uuid");

// Creates a client
const storage = new Storage({
  keyFilename: path.join(__dirname, "../serviceAccountKey.json"),
  projectId: config.firebaseConfig.projectId,
});

const bucket = storage.bucket(config.firebaseConfig.storageBucket);

const uploadFile = async (file, uid, filename) => {
  await bucket.upload(file.path, {
    destination: uid + "/" + filename,
  });
};

const deleteFile = async (fileName) => {
  await bucket.file(fileName).delete();
  console.log(`gs://${bucketName}/${fileName} deleted`);
};

const addVideo = async (req, res) => {
  try {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(400).json({
          error: err,
          msg: "FormData error",
        });
      }

      const { title, description } = fields;
      const { thumbnail, videoFile } = files;
      if (!title) return res.status(400).json({ msg: "No Title Found!" });
      if (!description)
        return res.status(400).json({ msg: "No Description Found!" });
      if (!thumbnail)
        return res.status(400).json({ msg: "No Thumbnail Found!" });
      if (!videoFile)
        return res.status(400).json({ msg: "No VideoFile Found!" });

      // created uid here for using it in storage folder structure before saving data in firestore
      let uid = v4();
      const thumbName =
        "thumbnail." +
        thumbnail.name.split(".")[thumbnail.name.split(".").length - 1];
      const videoName =
        "video." +
        videoFile.name.split(".")[videoFile.name.split(".").length - 1];
      uploadFile(files.thumbnail, uid, thumbName);
      uploadFile(files.videoFile, uid, videoName);

      let timestamp = Date.now();
      // timestamp = firestore.FieldValue.serverTimestamp();

      await firestore.collection("videos").doc(uid).set({
        createdAt: timestamp,
        lastUpdatedAt: timestamp,
        title,
        description,
        thumbnail: thumbName,
        videoFile: videoName,
      });
      res.send("VIDEO ADDED SUCCESSFULLY");
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getAllVideos = async (req, res) => {
  try {
    let snapshot = await firestore.collection("videos").get();

    let videos = snapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    return res.json(videos);
  } catch (error) {
    res.status(400).json({
      error: error.message,
      msg: "no videos found in db!",
    });
  }
};

const updateVideo = (req, res) => {
  try {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(400).json({
          error: err,
          msg: "FormData error",
        });
      }

      const { id, title, description } = fields;
      const { thumbnail, videoFile } = files;
      if (!id) return res.status(400).json({ msg: "No ID Found!" });

      let thumbName = "",
        videoName = "";
      if (thumbnail) {
        console.log("I AM UPLOADING THUMB");
        thumbName =
          "thumbnail." +
          thumbnail.name.split(".")[thumbnail.name.split(".").length - 1];
        uploadFile(thumbnail, id, thumbName);
      }
      if (videoFile) {
        console.log("I AM UPLOADING VIDEO");
        videoName =
          "video." +
          videoFile.name.split(".")[videoFile.name.split(".").length - 1];
        uploadFile(videoFile, id, videoName);
      }
      if (thumbnail && videoFile) {
        await firestore.collection("videos").doc(id).update({
          lastUpdatedAt: Date.now(),
          title,
          description,
          thumbnail: thumbName,
          videoFile: videoName,
        });
      } else if (thumbnail) {
        await firestore.collection("videos").doc(id).update({
          lastUpdatedAt: Date.now(),
          title,
          description,
          thumbnail: thumbName,
        });
      } else if (videoFile) {
        await firestore.collection("videos").doc(id).update({
          lastUpdatedAt: Date.now(),
          title,
          description,
          videoFile: videoName,
        });
      } else {
        await firestore.collection("videos").doc(id).update({
          lastUpdatedAt: Date.now(),
          title,
          description,
        });
      }
      res.send("VIDEO UPDATED SUCCESSFULLY");
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      msg: "Error updating video!",
    });
  }
};

const deleteVideo = (req, res) => {
  try {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(400).json({
          error: err,
          msg: "FormData error",
        });
      }
      const { id } = fields;
      if (!id) return res.status(400).json({ msg: "No ID Found!" });

      await firestore.collection("videos").doc(id).delete();

      res.send("VIDEO DELETED SUCCESSFULLY");
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      msg: "Error deleting video",
    });
  }
};

module.exports = {
  addVideo,
  getAllVideos,
  updateVideo,
  deleteVideo,
};
