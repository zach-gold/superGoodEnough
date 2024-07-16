import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import "./AllRoutes.css";
import { getRoutesThunk } from "../../redux/route";

const AllRoutes = () => {
  // const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchRoutes = async () => {
  //     const response = await fetch("/api/routes");
  //     const data = await response.json();
  //     setRoutes(data.Routes);
  //     setLoading(false);
  //   };

  //   fetchRoutes();
  // }, []);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const routes = useSelector((state) => state.routes);
  const user = useSelector((state) => state.session.user);

  const handleAddRoute = () => {
    if (user) {
      navigate(`/routes/new`);
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    dispatch(getRoutesThunk());
    setLoading(false)
  }, [dispatch]);

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
