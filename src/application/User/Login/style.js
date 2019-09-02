import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  position: fixed;
  bottom: 0;
  top: 0;
  left: 0;
  right: 0;
  background: #e82101;
  flex-direction: column;
  align-items: center;
`;

export const LogoImg = styled.img.attrs({
  src: require("../../../assets/netease-logo.svg")
})`
  width: 100px;
  flex: 3;
`;
