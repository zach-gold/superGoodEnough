import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
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

  const dispatch = useDispatch();
  const routes = useSelector((state) => state.routes);

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
        <Link to="/routes/new" className="create-route-link">
          Create A New Route
        </Link>
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
