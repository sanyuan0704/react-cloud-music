import React, { useState } from "react";
import { Header, Container } from "./style";

const trimPhone = val => val.replace(/(^\s+)|(\s+$)|\s+/g, "");
const PhoneForm = ({ loginByPhone, onClickBack }) => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const onClickLogin = () => {
    loginByPhone(trimPhone(phone), password);
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

  const onChangePassword = e => {
    setPassword(e.target.value);
  };

  return (
    <Container>
      <Header>
        <img
          src={require("../../../../../assets/back.svg")}
          alt=""
          onClick={onClickBack}
        />
        手机号登录
      </Header>

      <p className="tips">
        &emsp;&emsp;暂时不支持验证码登录，请输入手机号和密码
      </p>

      <p className="input">
        +86
        <input type="text" onChange={onChangePhone} value={phone} />
      </p>
      <hr />
      <p className="input">
        密码：
        <input type="password" onChange={onChangePassword} value={password} />
      </p>

      <hr />
      <span
        className={`LoginBtn 
          ${(trimPhone(phone).length < 11 || !password) && "disabled"}`}
        onClick={onClickLogin}
      >
        登录
      </span>
    </Container>
  );
};
export default PhoneForm;
