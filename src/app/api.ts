const BASE_URL = "https://eventease-adw2.onrender.com";

export const API_ENDPOINTS = {
  REGISTER: `${BASE_URL}/api/v1/auth/register`,
  LOGIN: `${BASE_URL}/api/v1/auth/login`,
  CREATE_EVENT: `${BASE_URL}/api/v1/auth/event/createEvent`,
  UPDATE_EVENTPICTURE: `${BASE_URL}/api/v1/auth/event/updateEventPicture/`,
  UPDATE_EVENT: `${BASE_URL}/api/v1/auth/event/updateEvent/`,
  GET_ALL_EVENTS: `${BASE_URL}/api/v1/auth/event/getAllEvents`,
  GET_EVENT_PICTURE: `${BASE_URL}/api/v1/auth/event/getEventPicture/`,
  GET_EVENT_BY_ID: `${BASE_URL}/api/v1/auth/event/getEventById/`,
  GET_USER_BY_ID: `${BASE_URL}/api/v1/auth/user/`
};
