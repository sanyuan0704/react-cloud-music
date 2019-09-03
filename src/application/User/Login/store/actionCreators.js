import {
  loginByPhoneRequest,
  sentVcodeRequest,
  loginByVcodeRequest
} from "../../../../api/request";
import { CHANGE_USER_INFO, CHANGE_SENT_STATUS } from "./constants";

export const saveUserInfo = data => ({
  type: CHANGE_USER_INFO,
  data
});

export const saveSentStatus = data => ({
  type: CHANGE_SENT_STATUS,
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

export const loginByVcode = (phone, vcode) => {
  return dispatch => {
    loginByVcodeRequest(phone, vcode)
      .then(res => {
        dispatch(saveUserInfo(res));
      })
      .catch(() => {
        console.log("登录失败！");
      });
  };
};

export const sentVcode = phone => {
  return dispatch => {
    sentVcodeRequest(phone)
      .then(res => {
        if (res.code === 200) {
          dispatch(saveSentStatus(true));
        }
      })
      .catch(() => {
        console.log("请求失败！");
      });
  };
};
