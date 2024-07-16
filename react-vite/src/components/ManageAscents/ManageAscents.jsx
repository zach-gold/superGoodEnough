import { useEffect, useState } from "react";
import { useDispatch, useSelector,  } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteAscentThunk, getAllAscentsThunk } from "../../redux/ascent";
import "./ManageAscents.css";

function filterById(ascents, userId) {
  const result = [];
  for (const ascent in ascents) {
    if (ascents[ascent].user_id === userId) {
      result[ascent] = ascents[ascent];
    }
  }
  return result;
}

const ManageAscents = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector((state) => state.session.user.id);
  const ascents = useSelector((state) => state.ascents);
  const [loading, setLoading] = useState(true);
  const [deleted, setDeleted] = useState(false);
  let userAscents = filterById(ascents, userId);

  useEffect(() => {
    dispatch(getAllAscentsThunk());
    setLoading(false);
  }, [dispatch, deleted]);

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteAscentThunk(id));
      setDeleted(!deleted);
    } catch (error) {
      console.error("Error deleting route:", error);
    }
  };

  const handleEdit = (id) => {
    navigate(`/ascents/${id}/update`);
  };


    if (loading) {
      return <div>Loading...</div>;
    }

  return (
    <div className="manage-ascents-container">
      <h2>Manage Ascents</h2>
      <div className="ascents-list">
        {Object.values(userAscents).map((ascent) => (
          <div key={ascent.id} className="ascent-item">
            {ascent.images.length > 0 && (
              <div className="ascent-image-container">
                <img
                  src={ascent.images[0].picture_url}
                  alt="Ascent"
                  className="ascent-image"
                />
              </div>
            )}
            <div className="ascent-details">
              <h3>{ascent.parent_route.name}</h3>
              <p>Date: {new Date(ascent.date).toLocaleDateString()}</p>
              <p>Style: {ascent.style}</p>
              <p>Notes: {ascent.notes}</p>
            </div>
            <div className="ascent-actions">
              <button
                className="update-button"
                onClick={() => handleEdit(ascent.id)}
              >
                Edit
              </button>
              <button
                className="delete-button"
                onClick={() => handleDelete(ascent.id)}
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

export default ManageAscents;
