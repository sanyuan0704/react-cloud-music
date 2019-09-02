/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { withRouter } from "react-router-dom";
import {
  Button,
  BeautyCheckBox,
  OtherLoginLink,
  FormContainer
} from "./LoginForm.style";

const noEffect = e => e.preventDefault();

const LoginForm = ({ history }) => {
  const jumpToIndex = () => {
    history.push("/recommend");
  };
  const loginViaThirdApi = () => {
    alert("第三方登录待开发....");
  };
  return (
    <FormContainer>
      <Button background="#fff" onClick={jumpToIndex}>
        手机号登录
      </Button>
      <Button color="#fff" onClick={jumpToIndex}>
        立即体验
      </Button>
      <BeautyCheckBox>
        <li>
          <input type="radio" id="tiaokuan" hidden />
          <label for="tiaokuan"></label>
          <span>
            同意<a onClick={noEffect}>{"<<服务条款>>"}</a>和
            <a onClick={noEffect}>{"<<隐私政策>>"}</a>
          </span>
        </li>
      </BeautyCheckBox>
      <OtherLoginLink>
        <img
          onClick={loginViaThirdApi}
          src={require("../../../../assets/wechat.svg")}
          alt=""
        />
        <img
          onClick={loginViaThirdApi}
          src={require("../../../../assets/sina.svg")}
          alt=""
        />
        <img
          onClick={loginViaThirdApi}
          src={require("../../../../assets/mail.svg")}
          alt=""
        />
      </OtherLoginLink>
    </FormContainer>
  );
};

export default withRouter(LoginForm);
