import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createAscentThunk, thunkAddAscentImage } from "../../redux/ascent"; // TODO
import "./CreateAscent.css";

const CreateAscent = () => {
  const { routeId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.session.user);

  const [date, setDate] = useState("");
  const [style, setStyle] = useState("");
  const [notes, setNotes] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const errors = {};

    if (!date) {
      errors.date = "Date is required";
    } else if (new Date(date) > new Date()) {
      errors.date = "Date cannot be in the future";
    }

    if (style.length > 25) {
      errors.style = "Style must be less than 25 characters";
    }
    if (notes.length > 2000) {
      errors.notes = "Notes must be less than 2000 characters";
    }

    setErrors(errors);
  }, [date, style, notes]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newAscent = {
      route_id: routeId,
      date: date,
      style: style,
      notes: notes,
    };

    console.log(newAscent);

    const response = await dispatch(createAscentThunk(newAscent, routeId));
    if (response.errors) {
      setErrors(response.errors);
    } else {
      if (image) {
        setImageLoading(true);
        const imgResponse = await dispatch(
          thunkAddAscentImage(response.id, image)
        );
        if (imgResponse.errors) {
          setErrors(imgResponse.errors);
        } else {
          navigate(`/routes/${routeId}`);
        }
      }
      navigate(`/routes/${routeId}`);
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
    <div className="create-ascent-container">
      <h2>Add Your Ascent</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group">
          <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
            <label className="create-ascent-label" htmlFor="date">
              Date
            </label>
            {errors.date && <span className="error">{errors.date}</span>}
          </div>
          <input
            type="date"
            className="create-ascent-input"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
            <label className="create-ascent-label" htmlFor="style">
              Style
            </label>
            {errors.style && <span className="error">{errors.style}</span>}
          </div>
          <input
            type="text"
            className="create-ascent-input"
            id="style"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            placeholder="e.g., lead, trad, top-rope, bouldering"
          />
        </div>
        <div className="form-group">
          <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
            <label className="create-ascent-label" htmlFor="notes">
              Notes
            </label>
            {errors.notes && <span className="error">{errors.notes}</span>}
          </div>
          <textarea
            id="notes"
            className="create-ascent-input"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional notes..."
          />
        </div>
        <div className="form-group">
          <div className="photo-div">
            <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
              <label className="create-ascent-label">Photos and video *</label>
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
          Add Ascent
        </button>
      </form>
    </div>
  );
};

export default CreateAscent;
