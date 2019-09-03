import React, { useState } from "react";
import { Container, LogoImg, LogoContainer, LoginContainer } from "./style";
import * as actionCreators from "./store/actionCreators";
import LoginForm from "./components/LoginForm";
import PhoneForm from "./components/PhoneForm";

import { CSSTransition } from "react-transition-group";
import { connect } from "react-redux";

const Login = props => {
  const { LoginByVcodeDispatch, sentVcodeDispatch, sentStatus } = props;
  const [inPhone, setInPhone] = useState(false);
  const jumpToLogin = method => {
    if (method === "phone") {
      setInPhone(true);
    }
  };
  const onPhoneBack = () => {
    setInPhone(false);
  };
  return (
    <>
      <CSSTransition in={!inPhone} timeout={500} classNames="push-out">
        <Container>
          <LogoContainer>
            <div>
              <LogoImg />
            </div>
          </LogoContainer>
          <LoginForm jumpToLogin={jumpToLogin} />
        </Container>
      </CSSTransition>
      <CSSTransition in={inPhone} timeout={500} classNames="push-in">
        <LoginContainer>
          <PhoneForm
            // loginByPhone={LoginByPhoneDispatch}
            loginByVcode={LoginByVcodeDispatch}
            onClickBack={onPhoneBack}
            sentVcode={sentVcodeDispatch}
            sentStatus={sentStatus}
          />
        </LoginContainer>
      </CSSTransition>
    </>
  );
};

// 映射Redux全局的state到组件的props上
const mapStateToProps = state => ({
  userInfo: state.getIn(["user", "userInfo"]),
  sentStatus: state.getIn(["user", "sentStatus"])
});
// 映射dispatch到props上
const mapDispatchToProps = dispatch => {
  return {
    LoginByPhoneDispatch(phone, password) {
      dispatch(actionCreators.loginByPhone(phone, password));
    },
    LoginByVcodeDispatch(phone, vcode) {
      dispatch(actionCreators.loginByVcode(phone, vcode));
    },
    sentVcodeDispatch(phone) {
      dispatch(actionCreators.sentVcode(phone));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(Login));
