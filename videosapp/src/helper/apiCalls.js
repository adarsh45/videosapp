import axios from "axios";
import { API } from "../backend";

export const getAllVideos = () => {
  const promise = new Promise((resolve, reject) => {
    axios
      .get(`${API}/get`)
      .then((res) => {
        const { data, status } = res;
        if (status === 200) {
          resolve(data);
        } else {
          reject(res);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
  return promise;
};

export const addVideo = (videoData) => {
  const data = new FormData();
  data.append("title", videoData.title);
  data.append("description", videoData.description);
  data.append("thumbnail", videoData.thumbnail);
  data.append("videoFile", videoData.videoFile);
  const promise = new Promise((resolve, reject) => {
    axios
      .post(`${API}/add`, data, {})
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
  return promise;
};

export const updateVideo = (videoData) => {
  const data = new FormData();
  data.append("id", videoData.id);
  data.append("title", videoData.title);
  data.append("description", videoData.description);
  if (videoData.thumbnail) {
    data.append("thumbnail", videoData.thumbnail);
  }
  if (videoData.videoFile) {
    data.append("videoFile", videoData.videoFile);
  }
  const promise = new Promise((resolve, reject) => {
    axios
      .post(`${API}/update`, data, {})
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
  return promise;
};

export const deleteVideo = (id) => {
  const data = new FormData();
  const promise = new Promise((resolve, reject) => {
    if (!id) {
      reject("No ID found!");
    }
    data.append("id", id);
    console.log("ID: ", data);
    axios
      .delete(`${API}/delete`, { data })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
  return promise;
};
