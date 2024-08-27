import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getOneRouteThunk } from "../../redux/route";
import "./RouteDetails.css";

const RouteDetails = () => {
  const { routeId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const route = useSelector((state) => state.routes[routeId]);

  // useEffect(() => {
  //     // Fetch route details direct from backend for the time being, just to get content on the page
  //     const fetchRouteDetails = async () => {
  //         const response = await fetch(`/api/routes/${routeId}`);
  //         const data = await response.json();
  //         setRoute(data.Route);
  //     };

  //     fetchRouteDetails();
  // }, [routeId]);

  useEffect(() => {
    dispatch(getOneRouteThunk(routeId));
  }, [dispatch, routeId]);

  const handleAddAscent = () => {
    if (user) {
      navigate(`/routes/${routeId}/ascents/new`);
    } else {
      navigate("/login");
    }
  };

  if (!route) {
    return <div>Loading...</div>;
  }

  return (
    <div className="route-details-container">
      <div className="route-header">
        <h1>{route.name}</h1>
        <p>Grade: {route.grade}</p>
        <p>Location: {route.location}</p>
        <p>
          Created by:{" "}
          <Link to={`/users/${route.created_by}`}>{route.author}</Link>
        </p>
      </div>
      <div className="route-images">
        <h2>Images</h2>
        {route.images?.map((image) => (
          <img
            key={image.id}
            src={image.picture_url}
            alt={`Route ${route.name}`}
          />
        ))}
      </div>
      <div className="route-description">
        <h2>Description</h2>
        <p>{route.description}</p>
      </div>
      <div className="route-ascents">
        <h2>Ascents</h2>
        {route.ascents?.map((ascent) => (
          <div key={ascent.id} className="ascent-details">
            <p>
              Climber:{" "}
              <Link to={`/users/${ascent.user_id}`}>
                {ascent.author.username}
              </Link>
            </p>
            <p>Date: {new Date(ascent.date).toLocaleDateString()}</p>
            <p>Style: {ascent.style}</p>
            <p>Notes: {ascent.notes}</p>
            <div className="ascent-images">
              {ascent.images?.map((image) => (
                <img
                  key={image.id}
                  src={image.picture_url}
                  alt={`Ascent by ${ascent.author.username}`}
                />
              ))}
            </div>
          </div>
        ))}
        <button className="add-ascent-button" onClick={handleAddAscent}>
          Add Your Ascent!
        </button>
      </div>
    </div>
  );
};

export default RouteDetails;
