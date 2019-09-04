import * as actionTypes from "./constants";
import { fromJS } from "immutable";

const defaultState = fromJS({
  userInfo: {},
  sentStatus: false,
  loginStatus: false
});

export default (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.CHANGE_USER_INFO:
      return state.set("userInfo", action.data);
    case actionTypes.CHANGE_SENT_STATUS:
      return state.set("sentStatus", action.data);
    case actionTypes.CHANGE_LOGIN_STATUS:
      return state.set("loginStatus", action.data);
    default:
      return state;
  }
};
