import React, { useState, useRef, useEffect } from "react";
import { Container, LogoImg, LogoContainer, LoginContainer } from "./style";
import { withRouter } from "react-router-dom";
import * as actionCreators from "./store/actionCreators";
import LoginForm from "./LoginForm";
import PhoneForm from "./PhoneForm";

import { CSSTransition } from "react-transition-group";
import { connect } from "react-redux";

const Login = props => {
  const {
    LoginByVcodeDispatch,
    sentVcodeDispatch,
    sentStatus,
    loginStatus,
    changeSentStatusDispatch,
    history
  } = props;
  const [inPhone, setInPhone] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const checkBoxRef = useRef();

  useEffect(() => {
    if (loginStatus) {
      history.push("/recommend");
    }
  }, [loginStatus, history]);

  const jumpToIndex = () => {
    history.push("/recommend");
  };

  const jumpToLogin = method => {
    if (!agreed) {
      // alert("请同意条款");
      checkBoxRef.current.classList.add("shake-horizontal");
      setTimeout(() => {
        checkBoxRef.current.classList.remove("shake-horizontal");
      }, 500);
      return;
    }
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
          <LoginForm
            jumpToLogin={jumpToLogin}
            jumpToIndex={jumpToIndex}
            setAgreed={setAgreed}
            ref={checkBoxRef}
          />
        </Container>
      </CSSTransition>
      <CSSTransition
        in={inPhone}
        timeout={500}
        classNames="push-in"
        unmountOnExit
        onExited={() => changeSentStatusDispatch()}
      >
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
  sentStatus: state.getIn(["user", "sentStatus"]),
  loginStatus: state.getIn(["user", "loginStatus"])
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
    },
    changeSentStatusDispatch() {
      dispatch(actionCreators.saveSentStatus(false));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(withRouter(Login)));
