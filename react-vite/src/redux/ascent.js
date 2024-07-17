// Action types for different ascent-related actions
const GET_ASCENT = "ascent/getAscents";
const CREATE_ASCENT = "ascent/createAscent";
const UPDATE_ASCENT = "ascent/updateAscent";
const DELETE_ASCENT = "ascent/deleteAscent";
const ADD_ASCENT_IMAGE = "ascent/addImage";

// Action creator for getting all ascents
const getAll = (ascents) => ({
  type: GET_ASCENT,
  payload: ascents,
});

// Action creator for creating a new ascent
const createOne = (ascent) => ({
  type: CREATE_ASCENT,
  payload: ascent,
});

// Action creator for updating an ascent
const updateAscents = (ascent) => ({
  type: UPDATE_ASCENT,
  payload: ascent,
});

// Action creator for deleting an ascent
const delAscent = (id) => ({
  type: DELETE_ASCENT,
  payload: id,
});

// Action creator for adding an image to an ascent
const addAscentImage = (ascentId, image) => ({
  type: ADD_ASCENT_IMAGE,
  ascentId,
  image,
});

// Thunk for fetching all ascents from the server
export const getAllAscentsThunk = () => async (dispatch) => {
  const response = await fetch(`/api/ascents`);
  if (response.ok) {
    const { Ascents } = await response.json();
    await dispatch(getAll(Ascents));
    return Ascents;
  }
};

// Thunk for creating a new ascent
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

// Thunk for adding an image to an ascent
export const thunkAddAscentImage = (ascentId, image) => async (dispatch) => {
  const formData = new FormData();
  formData.append("image", image);
  const res = await fetch(`/api/images/ascent/${ascentId}`, {
    method: "POST",
    body: formData,
  });
  if (res.ok) {
    const ascentImage = await res.json();
    dispatch(addAscentImage(ascentId, ascentImage));
    return ascentImage; // return the ascent image data
  } else {
    const error = await res.json();
    return error;
  }
};

// Thunk for updating an ascent
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

// Thunk for deleting an ascent
export const deleteAscentThunk = (id) => async (dispatch) => {
  const res = await fetch(`/api/ascents/${id}`, {
    method: "DELETE",
  });
  if (res.ok) {
    const { Id } = await res.json();
    await dispatch(delAscent(Id));
  }
};

// Initial state for the ascent reducer
const initialState = {};

// Ascent reducer to handle different ascent actions
const ascentReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ASCENT: {
      // Handle getting all ascents
      const newState = { ...state.ascents };
      action.payload.forEach((ascent) => (newState[ascent.id] = ascent));
      return newState;
    }
    case CREATE_ASCENT: {
      // Handle creating a new ascent
      const newState = { ...state };
      newState[action.payload.id] = action.payload;
      return newState;
    }
    case UPDATE_ASCENT: {
      // Handle updating an ascent
      const newState = { ...state };
      newState[action.payload.id] = action.payload;
      return newState;
    }
    case DELETE_ASCENT: {
      // Handle deleting an ascent
      const newState = {};
      for (let val of Object.values(state)) {
        if (val.id !== action.payload) {
          newState[val.id] = val;
        }
      }
      return newState;
    }
    case ADD_ASCENT_IMAGE: {
      // Handle adding an image to an ascent
      const newState = { ...state };
      return newState;
    }
    default:
      return state;
  }
};

export default ascentReducer;
