import { useEffect, useState } from "react";
import {
  Button,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
} from "reactstrap";
import { STORAGE_URL } from "../backend";
import { addVideo, updateVideo } from "../helper/apiCalls";

const VideoFormModal = ({
  isOpen,
  toggleModal,
  selectedVideo,
  setSelectedVideo,
  refresh,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedVideo) {
      return handleUpdate();
    }
    if (!title || !description || !thumbnail || !videoFile) {
      return console.log("Some data missing!");
    }
    addVideo({ title, description, thumbnail, videoFile })
      .then((res) => {
        console.log("RESPONSE: ", res);
        toggleModal();
        refresh();
      })
      .catch((err) => {
        console.log("ERROR: ", err);
      });
  };

  const handleUpdate = () => {
    if (!title || !description) {
      return console.log("Some data missing!");
    }
    updateVideo({
      id: selectedVideo.id,
      title,
      description,
      thumbnail: thumbnail && thumbnail,
      videoFile: videoFile && videoFile,
    })
      .then((res) => {
        console.log("RES: ", res);
        toggleModal();
        refresh();
        setSelectedVideo(null);
      })
      .catch((err) => {
        console.log("ERR: ", err);
      });
  };

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

  useEffect(() => {
    if (selectedVideo) {
      setTitle(selectedVideo.title);
      setDescription(selectedVideo.title);
    }
  }, [selectedVideo]);

  return (
    <div>
      <Modal
        size="lg"
        isOpen={isOpen}
        toggle={toggleModal}
        className="video-modal"
      >
        <ModalHeader toggle={toggleModal}>Upload/Edit Video</ModalHeader>
        <ModalBody style={{ textAlign: "start" }}>
          <Form>
            <FormGroup>
              <Label>Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                name="title"
                id="title"
              />
            </FormGroup>
            <FormGroup>
              <Label>Description</Label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                type="textarea"
                name="description"
                id="description"
              />
            </FormGroup>
            {selectedVideo && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-around",
                }}
              >
                <img
                  style={{ width: "10rem", height: "auto" }}
                  src={`${STORAGE_URL}/${selectedVideo.id}/${selectedVideo.thumbnail}`}
                  alt="thumb"
                />
                <video width="320" height="240" controls>
                  <source
                    src={`${STORAGE_URL}/${selectedVideo.id}/${selectedVideo.videoFile}`}
                    type="video/webm"
                  />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
            <FormGroup>
              <Label for="thumbnail">Thumbnail Image</Label>
              <Input
                type="file"
                name="thumbnail"
                id="thumbnail"
                accept="image/*"
                onChange={(e) => {
                  setThumbnail(e.target.files[0]);
                }}
              />
            </FormGroup>
            <FormGroup>
              <Label for="videofile">Video File</Label>
              <Input
                type="file"
                name="videofile"
                id="videofile"
                accept="video/*"
                onChange={(e) => {
                  setVideoFile(e.target.files[0]);
                }}
              />
            </FormGroup>
            <div style={{ margin: "1em auto", textAlign: "center" }}>
              <Button
                type="submit"
                color="info"
                onClick={(e) => {
                  handleSubmit(e);
                }}
                style={{ margin: "0.2em" }}
              >
                {selectedVideo ? "Update" : "Save"}
              </Button>
              <Button
                type="cancel"
                color="secondary"
                onClick={() => {
                  toggleModal();
                  setSelectedVideo(null);
                }}
                style={{ margin: "0.2em" }}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default VideoFormModal;
