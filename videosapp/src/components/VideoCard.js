import { Button, Card, CardBody, CardSubtitle, CardTitle } from "reactstrap";
import { STORAGE_URL } from "../backend";
import { deleteVideo } from "../helper/apiCalls";

const VideoCard = ({ videoObj, toggleModal, setSelectedVideo, refresh }) => {
  const getDateTime = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };
  return (
    <Card>
      <div>
        <video
          width="400"
          height="300"
          poster={`${STORAGE_URL}/${videoObj.id}/${videoObj.thumbnail}`}
          controls
        >
          <source
            src={`${STORAGE_URL}/${videoObj.id}/${videoObj.videoFile}`}
            type="video/webm"
          />
        </video>
      </div>
      <CardBody style={{ textAlign: "start" }}>
        <CardTitle tag="h5">{videoObj.title}</CardTitle>
        <CardSubtitle tag="h6" className="mb-2 text-muted">
          {videoObj.description}
        </CardSubtitle>
        <p style={{ marginBottom: "0px" }}>
          Created At: {getDateTime(videoObj.createdAt)}
        </p>
        <p>Updated At: {getDateTime(videoObj.lastUpdatedAt)}</p>
        <div style={{ margin: "1em auto" }}>
          <Button
            color="info"
            onClick={() => {
              setSelectedVideo(videoObj);
              toggleModal();
            }}
            style={{ margin: "0px 0.2em" }}
          >
            Edit
          </Button>
          <Button
            color="danger"
            onClick={() => {
              deleteVideo(videoObj.id)
                .then((res) => {
                  console.log("RES: ", res);
                  refresh();
                })
                .catch((err) => {
                  console.log("ERR: ", err);
                });
            }}
            style={{ margin: "0px 0.2em" }}
          >
            Delete
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default VideoCard;
