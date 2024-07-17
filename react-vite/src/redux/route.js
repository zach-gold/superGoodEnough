// Action types for different route-related actions
const GET_ROUTES = "/route/getAll";
const GET_ONE_ROUTE = "/route/getOne";
const DELETE_ROUTE = "/route/remove";
const CREATE_ROUTE = "/route/create";
const UPDATE_ROUTE = "/route/update";
const ADD_ROUTE_IMAGE = "route/addImage";

// Action creator for getting all routes
const getRoutes = (routes) => ({
  type: GET_ROUTES,
  payload: routes,
});

// Action creator for getting one route
const getOneRoute = (route) => ({
  type: GET_ONE_ROUTE,
  payload: route,
});

// Action creator for deleting a route
const deleteRoute = (id) => ({
  type: DELETE_ROUTE,
  payload: id,
});

// Action creator for creating a new route
const createRoute = (route) => ({
  type: CREATE_ROUTE,
  payload: route,
});

// Action creator for updating a route
const updateRoute = (route) => ({
  type: UPDATE_ROUTE,
  payload: route,
});

// Action creator for adding an image to a route
const addRouteImage = (routeId, image) => ({
  type: ADD_ROUTE_IMAGE,
  routeId,
  image,
});

// Thunk for fetching all routes from the server
export const getRoutesThunk = () => async (dispatch) => {
  const response = await fetch("/api/routes");
  if (response.ok) {
    const { Routes } = await response.json();
    dispatch(getRoutes(Routes));
  } else {
    const data = await response.json();
    return data.errors;
  }
};

// Thunk for fetching one route by id from the server
export const getOneRouteThunk = (id) => async (dispatch) => {
  const response = await fetch(`/api/routes/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.ok) {
    const { Route } = await response.json();
    dispatch(getOneRoute(Route));
  } else {
    const data = await response.json();
    return data.errors;
  }
};

// Thunk for deleting a route by id
export const deleteRouteThunk = (id) => async (dispatch) => {
  const response = await fetch(`/api/routes/${id}`, {
    method: "DELETE",
  });
  if (response.ok) {
    const { Id } = await response.json();
    dispatch(deleteRoute(Id));
  } else {
    const data = await response.json();
    return data.errors;
  }
};

// Thunk for creating a new route
export const createRouteThunk = (route) => async (dispatch) => {
  const response = await fetch(`/api/routes/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(route),
  });
  if (response.ok) {
    const { Route } = await response.json();
    await dispatch(createRoute(Route));
    return Route.id;
  } else {
    const data = await response.json();
    return data;
  }
};

// Thunk for adding an image to a route
export const thunkAddRouteImage = (routeId, image) => async (dispatch) => {
  const formData = new FormData();
  formData.append("image", image);
  const res = await fetch(`/api/images/route/${routeId}`, {
    method: "POST",
    body: formData,
  });
  if (res.ok) {
    const routeImage = await res.json();
    dispatch(addRouteImage(routeId, routeImage));
    return routeImage; // return the route image data
  } else {
    const error = await res.json();
    return error;
  }
};

// Thunk for updating a route
export const updateRouteThunk = (route, routeId) => async (dispatch) => {
  const id = routeId;
  const response = await fetch(`/api/routes/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(route),
  });
  if (response.ok) {
    const { Route } = await response.json();
    dispatch(updateRoute(Route));
    return Route.id;
  } else {
    const data = await response.json();
    return data;
  }
};

// Initial state for the route reducer
const initialState = {};

// Route reducer to handle different route actions
const routeReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ROUTES: {
      // Handle getting all routes
      const newState = {};
      action.payload.forEach((route) => (newState[route.id] = route));
      return newState;
    }
    case GET_ONE_ROUTE: {
      // Handle getting one route
      const newState = { ...state };
      const route = action.payload;
      newState[action.payload.id] = route;
      return { ...newState };
    }
    case DELETE_ROUTE: {
      // Handle deleting a route
      const newState = { ...state, ...state.routes };
      delete newState[action.payload];
      return { ...newState };
    }
    case CREATE_ROUTE: {
      // Handle creating a new route
      let newState = { ...state };
      newState[action.payload.id] = action.payload;
      return newState;
    }
    case UPDATE_ROUTE: {
      // Handle updating a route
      const newState = { ...state };
      newState[action.payload.id] = { ...action.payload };
      return { ...newState };
    }
    case ADD_ROUTE_IMAGE: {
      // Handle adding an image to a route
      const newState = { ...state };
      return newState;
    }
    default:
      return state;
  }
};

export default routeReducer;
