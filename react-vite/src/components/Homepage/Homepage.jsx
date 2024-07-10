import { NavLink } from "react-router-dom";
import "./Homepage.css";

const Homepage = () => {
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
          <div className="routes-section">Routes</div>
          <div className="ascents-section">Ascents</div>
        </div>
      </div>
    </>
  );
};

export default Homepage;
