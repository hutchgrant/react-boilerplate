import {
  FETCH_USER,
  FETCH_RECOVERY,
  FETCH_VERIFICATION,
  LOGOUT_USER,
  INIT_FORM
} from '../actions/authTypes';

export default function(state = null, { type, payload }) {
  switch (type) {
    case FETCH_USER:
      if (payload.token) {
        localStorage.setItem('token', payload.token);
        localStorage.setItem('username', payload.username);
      } else {
        payload.token = null;
        const token = localStorage.getItem('token', payload.token);
        if (token) {
          payload.token = token;
        }
      }
      return { ...state, ...payload };
    case FETCH_RECOVERY:
      if (payload.success) {
        payload.error = null;
      }
      return { ...state, ...payload };
    case FETCH_VERIFICATION:
      return { ...state, ...payload };
    case INIT_FORM:
      return { ...state, error: null, success: null };
    case LOGOUT_USER:
      localStorage.clear();
      return { username: null, token: null };
    default:
      return state;
  }
}
