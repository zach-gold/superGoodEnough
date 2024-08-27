import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsersThunk } from "../../redux/user";

import "./UserProfilePage.css";

const UserProfilePage = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.users[userId]);

  useEffect(() => {
    dispatch(getUsersThunk());
    setLoading(false);
  }, [dispatch, userId]);

  if (!user) {
    return <p>Loading...</p>;
  }

  const handleEditProfile = () => {
    navigate(`/users/${userId}/edit`);
  };

  return (
    <div className="profile-holder">
      <div className="profile-header">
        <h1>{user.username}'s Profile</h1>
        <button className="edit-profile-button" onClick={handleEditProfile}>
          Edit Profile
        </button>
      </div>
      <div className="profile-container">
        <img
          src={user.profile_picture_url || "/default-profile.png"}
          alt="Profile"
          className="profile-picture"
        />
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>First Name:</strong> {user.first_name}
        </p>
        <p>
          <strong>Last Name:</strong> {user.last_name}
        </p>
        <p>
          <strong>Bio:</strong> {user.bio}
        </p>
      </div>
    </div>
  );
};

export default UserProfilePage;
