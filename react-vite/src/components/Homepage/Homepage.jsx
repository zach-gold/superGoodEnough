import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getRoutesThunk } from "../../redux/route";
import { getAllAscentsThunk } from "../../redux/ascent";
import "./Homepage.css";

const Homepage = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const routes = useSelector((state) => state.routes);
  const ascents = useSelector((state) => state.ascents);

  useEffect(() => {
    dispatch(getRoutesThunk());
    setLoading(false);
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAllAscentsThunk());
    setLoading(false);
  }, [dispatch]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className="home-page">
        <div className="banner">
          <div className="featured-route">
            <div className="featured-picture">Picture</div>
            <div className="featured-info">Route info</div>
          </div>
        </div>
        <div className="content">
          <div className="routes-section">
            <h2>Routes</h2>
            <div className="home-routes-list">
              {Object.values(routes).map((route) => (
                <div key={route.id} className="home-route-item">
                  <div className="home-route-details">
                    <Link to={`/routes/${route.id}`}>
                      <h3>{route.name}</h3>
                    </Link>
                    <p>{route.grade}</p>
                    <p>{route.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="ascents-section">
            <h2>Ascents</h2>
            <div className="home-ascents-list">
              {Object.values(ascents).map((ascent) => (
                <div key={ascent.id} className="home-ascent-item">
                  <div className="home-all-ascent-details">
                    <Link to={`/routes/${ascent.parent_route.id}`}>
                      <h3>{ascent.parent_route.name}</h3>
                    </Link>
                    <p>{new Date(ascent.date).toLocaleDateString()}</p>
                    <p>{ascent.style}</p>
                    <p>{ascent.notes}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Homepage;
