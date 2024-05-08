const BASE_URL = "http://localhost:8080";

export const API_ENDPOINTS = {
    REGISTER: `${BASE_URL}/api/v1/auth/register`,
    LOGIN: `${BASE_URL}/api/v1/auth/login`,
    CREATE_EVENT: `${BASE_URL}/api/v1/auth/event/createEvent`,
    UPDATE_EVENT: `${BASE_URL}/api/v1/auth/event/updateEventPicture/`,
    GET_ALL_EVENTS: `${BASE_URL}/api/v1/auth/event/getAllEvents`,
    GET_EVENT_PICTURE: `${BASE_URL}/api/v1/auth/event/getEventPicture/`,
  };
