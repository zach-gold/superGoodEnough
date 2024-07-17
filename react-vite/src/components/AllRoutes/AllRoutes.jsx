import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import "./AllRoutes.css";
import { getRoutesThunk } from "../../redux/route";

const AllRoutes = () => {
  // State to manage loading status
  const [loading, setLoading] = useState(true);

  // Setting up navigation hook
  const navigate = useNavigate();

  // Setting up dispatch to use Redux actions
  const dispatch = useDispatch();

  // Getting routes from the Redux store
  const routes = useSelector((state) => state.routes);

  // Getting user information from the Redux store
  const user = useSelector((state) => state.session.user);

  // Function to handle adding a new route
  const handleAddRoute = () => {
    if (user) {
      navigate(`/routes/new`);
    } else {
      navigate("/login");
    }
  };

  // Fetch all routes when component mounts
  useEffect(() => {
    dispatch(getRoutesThunk());
    setLoading(false);
  }, [dispatch]);

  // Show loading message if data is still being fetched
  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="routes-container">
      <div className="header">
        <h2>All Routes</h2>
        <button className="create-route-link" onClick={handleAddRoute}>
          Create A New Route
        </button>
      </div>
      <div className="routes-list">
        {/* Mapping through routes to display each one */}
        {Object.values(routes).map((route) => (
          <div key={route.id} className="route-item">
            {route.images.length > 0 && (
              <div className="route-image-container">
                <img
                  src={route.images[0].picture_url}
                  alt={route.name}
                  className="route-image"
                />
              </div>
            )}
            <div className="route-details">
              <Link to={`/routes/${route.id}`}>
                <h3>{route.name}</h3>
              </Link>
              <p>{route.grade}</p>
              <p>{route.location}</p>
            </div>
            <p>{route.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllRoutes;
