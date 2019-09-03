import styled from "styled-components";
import global from "../../../../../assets/global-style";

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  flex: 2;
`;
export const Button = styled.span`
  background: ${props =>
    props.background ? `${props.background}` : `${global["official-red"]}`};
  color: ${props =>
    props.color ? `${props.color}` : `${global["official-red"]}`};
  height: 50px;
  line-height: 50px;
  font-size: 18px;
  width: 70%;
  display: flex;
  justify-content: center;
  border-radius: 27px;
  align-items: center;
  border: 1px solid #fff;
  margin-bottom: 20px;
  cursor: pointer;
`;

export const BeautyCheckBox = styled.ul`
  display: flex;
  color: #de5245;
  font-size: 12px;
  li {
    display: flex;
    align-items: center;
    margin-left: 20px;
    &:first-child {
      margin-left: 0;
    }
  }
  input:checked + label {
    background-color: #fff;
  }
  label {
    margin-right: 5px;
    padding: 2px;
    border: 1px solid #fff;
    border-radius: 100%;
    width: 10px;
    height: 10px;
    background-clip: content-box;
    cursor: pointer;
    transition: all 300ms;
    &:hover {
      border-color: #fff;
      background-color: #fff;
      box-shadow: 0 0 7px #fff;
    }
  }
  a {
    color: #d79088;
  }
`;

export const OtherLoginLink = styled.div`
  margin-top: 30px;
  margin-bottom: 30px;
  width: 85%;
  display: flex;
  justify-content: space-around;
  img {
    width: 35px;
  }
`;
