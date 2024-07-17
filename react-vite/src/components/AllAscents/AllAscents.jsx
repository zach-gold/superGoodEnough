import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./AllAscents.css";
import { getAllAscentsThunk } from "../../redux/ascent";

const AllAscents = () => {
  // State to manage loading status
  const [loading, setLoading] = useState(true);

  // Setting up dispatch to use Redux actions
  const dispatch = useDispatch();

  // Getting ascents from the Redux store
  const ascents = useSelector((state) => state.ascents);

  // Fetch all ascents when component mounts
  useEffect(() => {
    dispatch(getAllAscentsThunk());
    setLoading(false);
  }, [dispatch]);

  // Show loading message if data is still being fetched
  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="ascents-container">
      <h2>All Ascents</h2>
      <div className="ascents-list">
        {/* Mapping through ascents to display each one */}
        {Object.values(ascents).map((ascent) => (
          <div key={ascent.id} className="ascent-item">
            {ascent.images.length > 0 && (
              <div className="ascent-image-container">
                <img
                  src={ascent.images[0].picture_url}
                  alt={`Ascent ${ascent.id}`}
                  className="ascent-image"
                />
              </div>
            )}
            <div className="all-ascent-details">
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
  );
};

export default AllAscents;
