import styled from "styled-components";

export const Container = styled.div`
  p.tips {
    color: #000;
  }
  p.vphone {
    display: flex;
    height: 30px;
    line-height: 30px;
    color: #9d9d9d;
    padding: 0 25px;
    margin-top: 10px;
    justify-content: space-between;
    .sentBtn {
      color: #0066cc;
    }
  }
`;
export const VcodeBox = styled.div`
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 60px;
  max-width: 320px;
  margin-left: auto;
  margin-right: auto;
  .heading-2 {
    color: #333333;
  }
  .v-code {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    width: 280px;
    margin-left: auto;
    margin-right: auto;
  }
  .v-code input {
    position: absolute;
    top: -100%;
    left: -100%;
    opacity: 0;
  }
  .v-code .line {
    position: relative;
    width: 40px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    font-size: 28px;
  }
  .v-code .line::after {
    display: block;
    position: absolute;
    content: "";
    left: 0;
    width: 100%;
    bottom: 0;
    height: 1px;
    background-color: #aaaaaa;
    transform: scaleY(0.5);
    transform-origin: 0 100%;
  }
  .v-code .line.animated::before {
    display: block;
    position: absolute;
    left: 50%;
    top: 20%;
    width: 1px;
    height: 60%;
    content: "";
    background-color: #333333;
    animation-name: coruscate;
    animation-duration: 1s;
    animation-iteration-count: infinite;
    animation-fill-mode: both;
  }
  /*.v-code .line.animated::before {
    display: block;
    content: '';
    position: absolute;
    left: 0;
    bottom: -1px;
    width: 100%;
    height: 2px;
    background-color: #000000;
  }*/
  @keyframes coruscate {
    0% {
      opacity: 0;
    }
    25% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    75% {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
`;
