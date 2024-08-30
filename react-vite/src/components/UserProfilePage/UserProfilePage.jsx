import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsersThunk } from "../../redux/user";
import { getRoutesThunk } from "../../redux/route";
import { getAllAscentsThunk } from "../../redux/ascent";


import "./UserProfilePage.css";

function filterAscentById(ascents, userId) {
  let ascentResult = [];
  for (const ascent in ascents) {
    if (ascents[ascent].user_id == userId) {
      ascentResult.push(ascents[ascent]);
    }
  }
  return ascentResult;
}

function filterRouteById(routes, userId) {
  let routeResult = [];
  for (const route in routes) {
    if (routes[route].created_by == userId) {
      routeResult.push(routes[route]);
    }
  }
  return routeResult;
}


const UserProfilePage = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  // const [image, setImage] = useState(null);
  // const [imageUrl, setImageUrl] = useState("");
  // const [imageLoading, setImageLoading] = useState(false);
  const user = useSelector((state) => state.users[userId]);
  const routes = useSelector((state) => state.routes);
  let userRoutes = filterRouteById(routes, userId);
  const ascents = useSelector((state) => state.ascents);
  let userAscents = filterAscentById(ascents, userId);


  useEffect(() => {
    dispatch(getUsersThunk());
    setLoading(false);
  }, [dispatch, userId]);

  useEffect(() => {
    dispatch(getRoutesThunk());
    setLoading(false);
  }, [dispatch, userId]);

  useEffect(() => {
    dispatch(getAllAscentsThunk());
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
      <div className="content">
        <div className="routes-section">
          <h2>Routes</h2>
          <div className="home-routes-list">
            {Object.values(userRoutes).map((route) => (
              <div key={route.id} className="home-route-item">
                <div className="home-route-details">
                  <Link to={`/routes/${route.id}`}>
                    <h3>{route.name}</h3>
                  </Link>
                  <p>{route.grade}</p>
                  <p className="home-route-location">{route.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="ascents-section">
          <h2>Ascents</h2>
          <div className="home-ascents-list">
            {Object.values(userAscents).map((ascent) => (
              <div key={ascent.id} className="home-ascent-item">
                <div className="home-all-ascent-details">
                  <Link to={`/routes/${ascent.parent_route.id}`}>
                    <h3>{ascent.parent_route.name}</h3>
                  </Link>
                  <p>{new Date(ascent.date).toLocaleDateString()}</p>
                  <p>{ascent.style}</p>
                  <p className="home-ascent-notes">{ascent.notes}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
