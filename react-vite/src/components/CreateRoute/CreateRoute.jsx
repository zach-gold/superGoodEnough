import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import { addRoute, createRoutePicture } from "../../store/routes"; //TODO
import "./CreateRoute.css";

const CreateRoute = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.session.user);

  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [location, setLocation] = useState("");
  const [areaId, setAreaId] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newRoute = {
      name: name,
      grade: grade,
      location: location,
      area_id: areaId,
      description: description,
    };

    // const response = await dispatch(addRoute(newRoute));
    // if (response.errors) {
    //   setErrors(response.errors);
    // } else {
    //   const formData = new FormData();
    //   formData.append("image", image);

    //   // aws uploads can be a bit slow—displaying
    //   // some sort of loading message is a good idea
    //   setImageLoading(true);
    //   const imgResponse = await dispatch(createRoutePicture(formData));
    //   if (imgResponse.errors) {
    //     setErrors(imgResponse.errors);
    //   } else {
    //     history.push("/images");
    //     navigate(`/routes/${response}`);
    //   }
    // }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setImage(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const handleFile = (file) => {
    if (
      file &&
      !["image/jpeg", "image/png", "image/gif", "application/pdf"].includes(
        file.type
      )
    ) {
      setErrors([
        "File does not have an approved extension: pdf, jpg, jpeg, png, gif",
      ]);
    } else {
      setImage(file);
      setErrors([]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="create-route-container">
      <h2>Add New Route</h2>
      <form onSubmit={handleSubmit}>
        {errors.length > 0 && (
          <ul>
            {errors.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>
        )}
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="grade">Grade</label>
          <input
            type="text"
            id="grade"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        {/* <div className="form-group">
          <label htmlFor="areaId">Area ID</label>
          <input
            type="number"
            id="areaId"
            value={areaId}
            onChange={(e) => setAreaId(e.target.value)}
            required
          />
        </div> */}
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="form-group">
          <div className="photo-div">
            <label>Photos and video *</label>
            <div
              className="dropzone"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {image ? image.name : "Drag and drop an image"}
            </div>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              id="image-upload"
              className="upload-button"
            />
            {imageUrl && (
              <p>
                Image URL:{" "}
                <a href={imageUrl} target="_blank" rel="noopener noreferrer">
                  {imageUrl}
                </a>
              </p>
            )}
            {imageLoading && <p>Loading...</p>}
          </div>
        </div>
        <button type="submit">Add Route</button>
      </form>
    </div>
  );
};

export default CreateRoute;
