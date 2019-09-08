import styled from "styled-components";

export const Container = styled.div`
  padding-top: 30%;
  width: 100%;
  > p.tips {
    color: #9d9d9d;
    font-size: 14px;
  }
  > p.input {
    font-weight: bold;
    font-size: 22px;
    margin-top: 30px;
    padding: 0 10%;
    white-space: nowrap;
    height: 30px;
    line-height: 30px;
    text-align: center;
    display: flex;
    justify-content: space-between;
    align-items: center;
    input {
      border: none;
      outline: none;
      flex: 1;
      padding-left: 10px;
      font-size: 22px;
      font-weight: bold;
      height: 30px;
      line-height: 30px;
    }
  }
  hr {
    margin: 0 10%;
    margin-top: 10px;
    background-color: #ccc;
    height: 1px;
    border: none;
  }
  .LoginBtn {
    display: block;
    cursor: pointer;
    width: 70%;
    margin: 0 auto;
    border-radius: 30px;
    height: 40px;
    background: #db3730;
    text-align: center;
    color: #fff;
    line-height: 40px;
    margin-top: 30px;
    &.disabled {
      opacity: 0.3;
    }
  }
`;
export const Header = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  height: 40px;
  font-weight: bold;
  line-height: 40px;
  text-align: center;
  font-size: 18px;
  > img {
    position: absolute;
    height: 20px;
    top: 10px;
    left: 0;
  }
`;
