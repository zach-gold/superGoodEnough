import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateRouteThunk, thunkAddRouteImage } from "../../redux/route"; //TODO
import "../CreateRoute/CreateRoute.css";

const UpdateRoute = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {routeId} = useParams();
    const user = useSelector((state) => state.session.user);
    const route = useSelector((state) => state.routes[routeId])

  const [name, setName] = useState(route?.name);
  const [grade, setGrade] = useState(route?.grade);
  const [location, setLocation] = useState(route?.location);
  const [areaId, setAreaId] = useState(route?.area_id? route.area_id : "");
  const [description, setDescription] = useState(route?.description);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    const errors = [];

    if (!name) {
      errors.push("Name is required");
    }

    if (location.length > 255) {
      errors.push("Location must be less than 255 characters");
    }
    if (description.length > 2000) {
      errors.push("Description must be less than 2000 characters");
    }

    const gradeRegexEuro = /^[0-9]{1,2}[A-Za-z]?$/;
    const gradeRegexNA = /^5\.\d+(?:[abcd]?[\+\-]?)?$/;
    if (grade && !gradeRegexEuro.test(grade) && !gradeRegexNA.test(grade)) {
      errors.push(
        "Grade must be a valid format (e.g., 5, 5a, 10, 12d, 5.10a, 5.11)"
      );
    }

    setErrors(errors);
  }, [name, grade, location, description]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedRoute = {
      name: name,
      grade: grade,
      location: location,
      area_id: areaId,
      description: description,
    };

    console.log(updatedRoute);

    let response = await dispatch(updateRouteThunk(updatedRoute, routeId));
    if (response?.errors) {
      setErrors(response.errors);
      console.log(errors);
    } else {
      // let formData = new FormData();
      // formData.append("image", image);

      // // aws uploads can be a bit slow—displaying
      // // some sort of loading message is a good idea
      setImageLoading(true);
      const imgResponse = await dispatch(thunkAddRouteImage(response, image));
      if (imgResponse.errors) {
        setErrors(imgResponse.errors);
      } else {
        // history.push("/images");
        navigate(`/routes/${response}`);
      }
    }
  }

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
      <h2>Update Your Route</h2>
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

export default UpdateRoute;
