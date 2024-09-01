import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  getUsersThunk,
  updateUserThunk,
  deleteUserThunk,
  thunkAddUserImage,
} from "../../redux/user";
import { thunkLogout } from "../../redux/session";
import "./UserProfileForm.css";

const UserProfileForm = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const user = useSelector((state) => state.users[userId]);
  const [firstName, setFirstName] = useState(user?.first_name || "");
  const [lastName, setLastName] = useState(user?.last_name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [profilePictureUrl, setProfilePictureUrl] = useState(
    user?.profile_picture_url
  );
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const newErrors = {};
    if (firstName && firstName.length > 25)
      newErrors.first_name = "First name cannot be more than 25 characters";
    if (lastName && lastName.length > 25)
      newErrors.last_name = "Last name cannot be more than 25 characters";
    if (bio && bio.length > 2000)
      newErrors.bio = "Bio must be less than 2000 characters";

    setErrors(newErrors);
  }, [firstName, lastName, bio]);

  useEffect(() => {
    dispatch(getUsersThunk());
    setLoading(false);
  }, [dispatch, userId]);

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name);
      setLastName(user.last_name);
      setBio(user.bio);
      setProfilePictureUrl(user.profile_picture_url);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      first_name: firstName,
      last_name: lastName,
      bio: bio,
    };
    const result = await dispatch(updateUserThunk(updatedUser, userId));
    if (result.errors) {
      setErrors(result.errors);
      console.log(result.errors);
    } else {
      if (image) {
        setImageLoading(true);
        const imgResponse = await dispatch(thunkAddUserImage(result, image));
        if (imgResponse.errors) {
          setErrors(imgResponse.errors);
        } else {
          navigate(`/users/${result}`);
        }
      }
      console.log("navigating");
      navigate(`/users/${userId}`);
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

  const handleDelete = () => {
    setShowModal(true);
  };

  const confirmDelete = () => {
    dispatch(deleteUserThunk(userId));
    dispatch(thunkLogout());
    navigate("/");
  };

  const cancelDelete = () => {
    setShowModal(false);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="user-profile-form-container">
      <h2>Update Profile</h2>
      <form onSubmit={handleSubmit} className="user-profile-form">
        <div className="form-group">
          <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
            <label htmlFor="first_name" className="create-route-label">
              First Name
            </label>
            {errors.first_name && (
              <span className="error">{errors.first_name}</span>
            )}
          </div>
          <input
            type="text"
            id="first_name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="create-route-input"
          />
        </div>
        <div className="form-group">
          <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
            <label htmlFor="last_name" className="create-route-label">
              Last Name
            </label>
            {errors.last_name && (
              <span className="error">{errors.last_name}</span>
            )}
          </div>
          <input
            type="text"
            id="last_name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="create-route-input"
          />
        </div>
        <div className="form-group">
          <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
            <label htmlFor="bio" className="create-route-label">
              Bio
            </label>
            {errors.bio && <span className="error">{errors.bio}</span>}
          </div>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="create-route-input"
          />
        </div>
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
        <button type="submit" disabled={Object.keys(errors).length > 0}>Update Profile</button>
        <button type="button" onClick={handleDelete} className="delete-button">
          Delete Profile
        </button>
      </form>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <p>Are you sure you want to delete your profile?</p>
            <button onClick={confirmDelete} className="delete-button">
              Yes, Delete
            </button>
            <button onClick={cancelDelete} className="cancel-button">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileForm;
