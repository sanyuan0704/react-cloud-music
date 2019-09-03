import * as actionTypes from "./constants";
import { fromJS } from "immutable";

const defaultState = fromJS({
  userInfo: {}
});

export default (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.CHANGE_USER_INFO:
      return state.set("userInfo", action.data);
    default:
      return state;
  }
};
