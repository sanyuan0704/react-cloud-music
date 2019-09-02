import React from "react";
import { Container, LogoImg } from "./style";
import LoginForm from "./components/LoginForm";

const Login = () => {
  return (
    <>
      <Container>
        <LogoImg />
        <LoginForm />
      </Container>
    </>
  );
};
export default Login;
