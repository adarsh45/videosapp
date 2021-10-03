import { useEffect, useState } from "react";
import { Button, Col, Row, Spinner } from "reactstrap";
import VideoCard from "./components/VideoCard";
import VideoFormModal from "./components/VideoFormModal";
import { getAllVideos } from "./helper/apiCalls";
import "./App.css";

function App() {
  const [videosList, setVideosList] = useState([]);

  const [isOpen, setIsOpen] = useState(false);
  const toggleModal = () => setIsOpen(!isOpen);

  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    getAllVideos()
      .then((data) => {
        console.log("RES: ", data);
        setVideosList(data);
      })
      .catch((err) => {
        console.log("ERR: ", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <header>
        <h1 className="heading">
          Videos<span style={{ color: "#60ccf0" }}>Gram</span>{" "}
        </h1>
      </header>
      <div className="div-center">
        <section>
          <Button className="refresh-btn" color="info" onClick={fetchData}>
            Refresh
          </Button>
          <Button className="add-btn" color="info" onClick={toggleModal}>
            + Add New Video
          </Button>
        </section>
        <section className="videos-list-section">
          <Row>
            {!loading ? (
              videosList.length ? (
                videosList.map((videoObj, index) => (
                  <Col md={4} key={index}>
                    <VideoCard
                      videoObj={videoObj}
                      setSelectedVideo={setSelectedVideo}
                      toggleModal={toggleModal}
                      refresh={fetchData}
                    />
                  </Col>
                ))
              ) : (
                <div>
                  No videos found!
                  <br /> Upload new by clicking Add button!{" "}
                </div>
              )
            ) : (
              <div>
                <Spinner type="grow" color="primary" />
              </div>
            )}
          </Row>
        </section>
      </div>
      <div>
        <VideoFormModal
          isOpen={isOpen}
          toggleModal={toggleModal}
          selectedVideo={selectedVideo}
          setSelectedVideo={setSelectedVideo}
          refresh={fetchData}
        />
      </div>
    </div>
  );
}

export default App;
