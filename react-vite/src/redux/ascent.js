const GET_ASCENT = "ascent/getAscents";
const CREATE_ASCENT = "ascent/createAscent";
const UPDATE_ASCENT = "ascent/updateAscent";
const DELETE_ASCENT = "ascent/deleteAscent";

const getAll = (ascents) => ({
  type: GET_ASCENT,
  payload: ascents,
});

const createOne = (ascent) => ({
  type: CREATE_ASCENT,
  payload: ascent,
});

const updateAscents = (ascent) => ({
  type: UPDATE_ASCENT,
  payload: ascent,
});

const delAscent = (id) => ({
  type: DELETE_ASCENT,
  payload: id,
});

export const getAllAscentsThunk = () => async (dispatch) => {
  const response = await fetch(`/api/ascents`);
  if (response.ok) {
    const { Ascents } = await response.json();
    await dispatch(getAll(Ascents));
    return Ascents;
  }
};

export const createAscentThunk = (ascent, id) => async (dispatch) => {
  const res = await fetch(`/api/routes/${id}/ascents`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ascent),
  });
  if (res.ok) {
    const { Ascent } = await res.json();
    dispatch(createOne(Ascent));
    return Ascent;
  } else {
    const data = await res.json();
    return data;
  }
};


export const updateAscentThunk = (ascent, ascentId) => async (dispatch) => {
  const res = await fetch(`/api/ascents/${ascentId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ascent),
  });
  if (res.ok) {
    const { Ascent } = await res.json();
    dispatch(updateAscents(Ascent));
    return Ascent;
  } else {
    const data = await res.json();
    return data;
  }
};

export const deleteAscentThunk = (id) => async (dispatch) => {
  const res = await fetch(`/api/ascents/${id}`, {
    method: "DELETE",
  });
  if (res.ok) {
    const { Id } = await res.json();
    await dispatch(delAscent(Id));
  }
};

const initialState = {};

const ascentReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ASCENT: {
      const newState = { ...state.ascents };
      action.payload.forEach((ascent) => (newState[ascent.id] = ascent));
      return newState;
    }
    case CREATE_ASCENT: {
      const newState = { ...state };
      newState[action.payload.id] = action.payload;
      return newState;
    }
    case UPDATE_ASCENT: {
      const newState = { ...state };
      newState[action.payload.id] = action.payload;
      return newState;
    }
    case DELETE_ASCENT: {
      const newState = {};
      for (let val of Object.values(state)) {
        if (val.id !== action.payload) {
          newState[val.id] = val;
        }
      }
      return newState;
    }
    default:
      return state;
  }
};

export default ascentReducer;
