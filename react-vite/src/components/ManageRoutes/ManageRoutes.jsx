import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getRoutesThunk, deleteRouteThunk } from "../../redux/route";
import "./ManageRoutes.css";

function filterById(routes, userId) {
  const result = [];
  for (const route in routes) {
    if (routes[route].created_by === userId) {
      result[route] = routes[route];
    }
  }
  return result;
}

const ManageRoutes = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
  const userId = useSelector((state) => state.session.user.id);
  const routes = useSelector((state) => state.routes);
  const [loading, setLoading] = useState(true);
  const [deleted, setDeleted] = useState(false);
  let userRoutes = filterById(routes, userId);

  useEffect(() => {
    dispatch(getRoutesThunk());
    setLoading(false);
  }, [dispatch, deleted]);

  const handleDelete = async (routeId) => {
    try {
      await dispatch(deleteRouteThunk(routeId));
      setDeleted(!deleted);
    } catch (error) {
      console.error("Error deleting route:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="manage-routes-container">
      <h2>Manage Your Routes</h2>
      <div className="routes-list">
        {Object.values(userRoutes).map((route) => (
          <div key={route.id} className="route-item">
            <div className="route-image-container">
              {route.images && route.images.length > 0 ? (
                <img
                  className="route-image"
                  src={route.images[0].picture_url}
                  alt={`${route.name} thumbnail`}
                />
              ) : (
                <div className="route-image-placeholder">No Image</div>
              )}
            </div>
            <div className="route-details">
              <h3>{route.name}</h3>
              <p>Grade: {route.grade}</p>
              <p>Location: {route.location}</p>
            </div>
            <div className="route-actions">
              <button
                className="update-button"
                onClick={() => navigate(`/routes/${route.id}/update`)}
              >
                Update
              </button>
              <button
                onClick={() => handleDelete(route.id)}
                className="delete-button"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageRoutes;
