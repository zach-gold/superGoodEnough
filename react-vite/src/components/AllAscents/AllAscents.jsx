import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./AllAscents.css";
import { getAllAscentsThunk } from "../../redux/ascent";

const AllAscents = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const ascents = useSelector((state) => state.ascents);

  useEffect(() => {
    dispatch(getAllAscentsThunk());
    setLoading(false);
  }, [dispatch]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="ascents-container">
      <h2>All Ascents</h2>
      <div className="ascents-list">
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
            <div className="details-notes-wrapper">
            <div className="all-ascent-details">
              <Link to={`/routes/${ascent.parent_route.id}`}>
                <h3>{ascent.parent_route.name}</h3>
              </Link>
              <p>{new Date(ascent.date).toLocaleDateString()}</p>
              <p>{ascent.style}</p>
            </div>
            <div className="ascent-notes">
              <p>{ascent.notes}</p>
              </div>
              </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllAscents;
