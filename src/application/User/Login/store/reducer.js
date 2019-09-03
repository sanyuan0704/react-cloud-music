import * as actionTypes from "./constants";
import { fromJS } from "immutable";

const defaultState = fromJS({
  userInfo: {},
  sentStatus: false,
  isLogin: false
});

export default (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.CHANGE_USER_INFO:
      return state.set("userInfo", action.data);
    case actionTypes.CHANGE_SENT_STATUS:
      return state.set("sentStatus", action.data);
    case actionTypes.CHANGE_IS_LOGIN:
      return state.set("isLogin", action.data);
    default:
      return state;
  }
};
