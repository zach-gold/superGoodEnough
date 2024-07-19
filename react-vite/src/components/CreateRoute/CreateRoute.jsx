import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createRouteThunk, thunkAddRouteImage } from "../../redux/route"; //TODO
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
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const errors = {};

    if (!name) {
      errors.name = "Name is required";
    }

    if (location.length > 255) {
      errors.location = "Location must be less than 255 characters";
    }
    if (description.length > 2000) {
      errors.description = "Description must be less than 2000 characters";
    }

    const gradeRegexEuro = /^[0-9]{1,2}[A-Za-z]?$/;
    const gradeRegexNA = /^5\.\d+(?:[abcd]?[\+\-]?)?$/;
    if (grade && !gradeRegexEuro.test(grade) && !gradeRegexNA.test(grade)) {
      errors.grade =
        "Grade must be a valid format (e.g., 5, 5a, 10, 12d, 5.10a, 5.11)";
    }

    setErrors(errors);
  }, [name, grade, location, description]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newRoute = {
      name: name,
      grade: grade,
      location: location,
      area_id: areaId,
      description: description,
    };

    let response = await dispatch(createRouteThunk(newRoute));
    if (response?.errors) {
      setErrors(response.errors);
      console.log(errors);
    } else {
      if (image) {
        setImageLoading(true);
        const imgResponse = await dispatch(thunkAddRouteImage(response, image));
        if (imgResponse.errors) {
          setErrors(imgResponse.errors);
        } else {
          navigate(`/routes/${response}`);
        }
      }
      navigate(`/routes/${response}`);
    }
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
      setErrors((prevErrors) => ({
        ...prevErrors,
        file: "File does not have an approved extension: pdf, jpg, jpeg, png, gif",
      }));
    } else {
      setImage(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="create-route-container">
      <h2>Add New Route</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group">
          <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
            <label className="create-route-label" htmlFor="name">
              Name
            </label>
            {errors.name && <span className="error">{errors.name}</span>}
          </div>
          <input
            type="text"
            className="create-route-input"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
            <label className="create-route-label" htmlFor="grade">
              Grade (Optional)
            </label>
            {errors.grade && <span className="error">{errors.grade}</span>}
          </div>
          <input
            type="text"
            className="create-route-input"
            id="grade"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
          />
        </div>
        <div className="form-group">
          <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
            <label className="create-route-label" htmlFor="location">
              Location (Optional)
            </label>
            {errors.location && (
              <span className="error">{errors.location}</span>
            )}
          </div>
          <input
            type="text"
            className="create-route-input"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className="form-group">
          <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
            <label className="create-route-label" htmlFor="description">
              Description (Optional)
            </label>
            {errors.description && (
              <span className="error">{errors.description}</span>
            )}
          </div>
          <textarea
            id="description"
            className="create-route-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="form-group">
          <div className="photo-div">
            <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
              <label className="create-route-label">Photos and video *</label>
              {errors.file && <span className="error">{errors.file}</span>}
            </div>
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
        <button
          type="submit"
          disabled={Object.values(errors).length ? true : false}
        >
          Add Route
        </button>
      </form>
    </div>
  );
};

export default CreateRoute;
