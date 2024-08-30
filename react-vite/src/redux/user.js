const GET_USERS = "/user/getAll";
const GET_ONE_USER = "/user/getOne";
const DELETE_USER = "/user/remove";
const CREATE_USER = "/user/create";
const UPDATE_USER = "/user/update";
const ADD_USER_IMAGE = "user/addImage";

const getUsers = (users) => ({
  type: GET_USERS,
  payload: users,
});

const getOneUser = (user) => ({
  type: GET_ONE_USER,
  payload: user,
});

const deleteUser = (id) => ({
  type: DELETE_USER,
  payload: id,
});

const updateUser = (user, userId) => ({
  type: UPDATE_USER,
    user, userId
});

const addUserImage = (userId, image) => ({
  type: ADD_USER_IMAGE,
  userId,
  image,
});

export const getUsersThunk = () => async (dispatch) => {
  const response = await fetch("/api/users/");
  if (response.ok) {
      const Users = await response.json();
    //   console.log(Users);
    dispatch(getUsers(Users));
  } else {
    const data = await response.json();
    return data.errors;
  }
};

export const getOneUserThunk = (id) => async (dispatch) => {
  const response = await fetch(`/api/users/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.ok) {
    const { User } = await response.json();
    dispatch(getOneUser(User));
  } else {
    const data = await response.json();
    return data.errors;
  }
};

export const deleteUserThunk = (id) => async (dispatch) => {
  const response = await fetch(`/api/users/${id}`, {
    method: "DELETE",
    // body: JSON.stringify({user})
  });
  if (response.ok) {
    const { Id } = await response.json();
    dispatch(deleteUser(Id));
  } else {
    const data = await response.json();
    return data.errors;
  }
};

export const thunkAddUserImage = (userId, image) => async (dispatch) => {
  const formData = new FormData();
  formData.append("image", image);
  const res = await fetch(`/api/images/user/${userId}`, {
    method: "POST",
    body: formData,
  });
  if (res.ok) {
    const userImage = await res.json();
    dispatch(addUserImage(userImage));
    return userImage; // return the user image data
  } else {
    const error = await res.json();
    return error;
  }
};

export const updateUserThunk = (user, userId) => async (dispatch) => {
  const id = userId;
  const response = await fetch(`/api/users/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  if (response.ok) {
      const { User } = await response.json();
    dispatch(updateUser(User));
      return User.id;
  } else {
    const data = await response.json();
    return data;
  }
};

const initialState = {};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_USERS: {
      const newState = {...state.users};
      action.payload.forEach((user) => (newState[user.id] = user));
      return newState;
    }
    case GET_ONE_USER: {
      const newState = { ...state };
      const user = action.payload;
      newState[action.payload.id] = user;
      return { ...newState };
    }
    case DELETE_USER: {
      const newState = { ...state, ...state.users };
      delete newState[action.payload];
      return { ...newState };
    }
    case CREATE_USER: {
      let newState = { ...state };
      newState[action.payload] = action.payload;
      return newState;
    }
    case UPDATE_USER: {
      const newState = { ...state };
      newState[action.payload] = { ...action.payload };
      return { ...newState };
    }
    case ADD_USER_IMAGE: {
      const newState = { ...state };
      // newState[action.payload.id] = { ...action.payload };
      return newState;
    }
    default:
      return state;
  }
};

export default userReducer;
