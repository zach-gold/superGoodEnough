import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  getUsersThunk,
  updateUserThunk,
  deleteUserThunk,
} from "../../redux/user";
import "./UserProfileForm.css";

const UserProfileForm = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const user = useSelector((state) => state.users[userId]);

  //   const [username, setUsername] = useState(user?.username || "");
  //   const [email, setEmail] = useState(user?.email || "");
  const [firstName, setFirstName] = useState(user?.first_name || "");
  const [lastName, setLastName] = useState(user?.last_name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [profilePictureUrl, setProfilePictureUrl] = useState(
    user?.profile_picture_url
  );
  const [errors, setErrors] = useState({});

  // console.log(user);

  useEffect(() => {
    dispatch(getUsersThunk());
    setLoading(false);
  }, [dispatch, userId]);

  useEffect(() => {
    if (user) {
      //   setUsername(user.username);
      //   setEmail(user.email);
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
      profile_picture_url: profilePictureUrl,
    };
    const result = await dispatch(updateUserThunk(updatedUser, userId));
    if (result) {
      setErrors(result);
    }
    navigate(`/users/${userId}`);
  };

    const handleDelete = () => {
      setShowModal(true);
    };

    const confirmDelete = () => {
      dispatch(deleteUserThunk(userId));
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
          <label htmlFor="first_name" className="create-route-label">
            First Name
          </label>
          <input
            type="text"
            id="first_name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="create-route-input"
          />
          {errors.first_name && <span className="error">{errors.first_name}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="last_name" className="create-route-label">
            Last Name
          </label>
          <input
            type="text"
            id="last_name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="create-route-input"
          />
          {errors.last_name && <span className="error">{errors.last_name}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="bio" className="create-route-label">
            Bio
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="create-route-input"
          />
          {errors.bio && <span className="error">{errors.bio}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="profile_picture_url" className="create-route-label">
            Profile Picture URL
          </label>
          <input
            type="url"
            id="profile_picture_url"
            value={profilePictureUrl || ""}
            onChange={(e) => setProfilePictureUrl(e.target.value)}
            className="create-route-input"
          />
          {errors.profile_picture_url && (
            <span className="error">{errors.profile_picture_url}</span>
          )}
        </div>
        <button type="submit">Update Profile</button>
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
