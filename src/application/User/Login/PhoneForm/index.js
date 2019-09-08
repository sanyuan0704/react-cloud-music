import React, { useState, useCallback } from "react";
import { Header, Container } from "./style";
import { trimPhone } from "../../../../api/utils";
import StepOne from "./step-one";
import StepTwo from "./step-two";

const PhoneForm = props => {
  const { onClickBack, sentVcode, sentStatus, loginByVcode } = props;
  const [phone, setPhone] = useState("");

  //验证码触发登录操作
  const triggerLogin = useCallback(
    vcode => {
      loginByVcode(trimPhone(phone), vcode);
    },
    [phone, loginByVcode]
  );

  //切换手机号码和验证码表单
  const triggerSentVcode = () => {
    sentVcode(trimPhone(phone));
  };

  const onChangePhone = e => {
    let newValue = e.target.value;
    let oldValue = phone;
    const result =
      newValue.length > oldValue.length
        ? newValue
            .replace(/[^\d]/gi, "")
            .replace(/(\d{3})(\d{0,4})(\d{0,4})/, "$1 $2 $3")
        : phone.trim().slice(0, -1);
    if (result && trimPhone(result).length > 11) {
      return;
    }
    setPhone(result);
  };

  return (
    <Container>
      <Header>
        <img
          src={require("../../../../assets/back.svg")}
          alt=""
          onClick={onClickBack}
        />
        手机号登录
      </Header>
      {!sentStatus ? (
        <StepOne
          onChangePhone={onChangePhone}
          onClickNext={triggerSentVcode}
          phone={phone}
        />
      ) : (
        <StepTwo
          triggerLogin={triggerLogin}
          phone={phone}
          reSentVcode={triggerSentVcode}
        />
      )}
    </Container>
  );
};
export default PhoneForm;
