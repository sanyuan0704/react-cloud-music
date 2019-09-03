import { loginByPhoneRequest } from "../../../../api/request";
import { CHANGE_USER_INFO } from "./constants";

export const saveUserInfo = data => ({
  type: CHANGE_USER_INFO,
  data
});

export const loginByPhone = (phone, password) => {
  return dispatch => {
    loginByPhoneRequest(phone, password)
      .then(res => {
        dispatch(saveUserInfo(res));
      })
      .catch(() => {
        console.log("登录失败！");
      });
  };
};
