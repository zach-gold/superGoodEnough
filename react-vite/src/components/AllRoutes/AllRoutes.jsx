import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./AllRoutes.css";

const AllRoutes = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoutes = async () => {
      const response = await fetch("/api/routes");
      const data = await response.json();
      setRoutes(data.Routes);
      setLoading(false);
    };

    fetchRoutes();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="routes-container">
      <h2>All Routes</h2>
      <div className="routes-list">
        {routes.map((route) => (
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
