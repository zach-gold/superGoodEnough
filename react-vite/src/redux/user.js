const LOAD_USERS = "users/LOAD_USERS";
const UPDATE_USER = "users/UPDATE_USER";
const DELETE_USER = "users/DELETE_USER";

const loadUsers = (users) => ({
  type: LOAD_USERS,
  users,
});

const updateUser = (user) => ({
  type: UPDATE_USER,
  user,
});

const deleteUser = (userId) => ({
  type: DELETE_USER,
  userId,
});

export const fetchUsers = () => async (dispatch) => {
  const response = await fetch("/api/users");
  const data = await response.json();
  dispatch(loadUsers(data.users));
};

export const editUser = (user) => async (dispatch) => {
  const response = await fetch(`/api/users/${user.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  const data = await response.json();
  if (response.ok) {
    dispatch(updateUser(data));
  } else {
    return data.errors;
  }
};

export const removeUser = (userId) => async (dispatch) => {
  const response = await fetch(`/api/users/${userId}`, {
    method: "DELETE",
  });
  if (response.ok) {
    dispatch(deleteUser(userId));
  }
};

const initialState = {};

const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_USERS:
      const newState = {};
      action.users.forEach((user) => {
        newState[user.id] = user;
      });
      return newState;
    case UPDATE_USER:
      return {
        ...state,
        [action.user.id]: action.user,
      };
    case DELETE_USER:
      const updatedState = { ...state };
      delete updatedState[action.userId];
      return updatedState;
    default:
      return state;
  }
};

export default usersReducer;
