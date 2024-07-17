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
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    const errors = [];

    if (!date) {
      errors.push("Date is required");
    } else if (new Date(date) > new Date()) {
      errors.push("Date cannot be in the future");
    }

    if (style.length > 25) {
      errors.push("Style must be less than 25 characters");
    }
    if (notes.length > 2000) {
      errors.push("Notes must be less than characters");
    }

    setErrors(errors);
  }, [date, style, notes]);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //
  // };

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
      // let formData = new FormData();
      // formData.append("image", image);

      // // aws uploads can be a bit slow—displaying
      // // some sort of loading message is a good idea
      if (image) {
        setImageLoading(true);
        const imgResponse = await dispatch(thunkAddAscentImage(response.id, image));
        if (imgResponse.errors) {
          setErrors(imgResponse.errors);
        } else {
          // history.push("/images");
          navigate(`/routes/${routeId}`);
        }
      }
      navigate(`/routes/${routeId}`);
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
    <div className="create-ascent-container">
      <h2>Add Your Ascent</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {errors.length > 0 && (
          <ul>
            {errors.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>
        )}
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="style">Style</label>
          <input
            type="text"
            id="style"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            placeholder="e.g., lead, trad, top-rope, bouldering"
          />
        </div>
        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional notes..."
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
          Add Ascent
        </button>
      </form>
    </div>
  );
};

export default CreateAscent;
