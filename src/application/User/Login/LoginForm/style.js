import styled from "styled-components";
import global from "../../../../assets/global-style";

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

  &.shake-horizontal {
    animation-name: shake-horizontal;
    animation-duration: 400ms;
    animation-timing-function: ease-in-out;
    animation-iteration-count: 5s;
    animation-play-state: running;
  }
  @keyframes shake-horizontal {
    2% {
      transform: translate(-5px, 0) rotate(0);
    }

    4% {
      transform: translate(8px, 0) rotate(0);
    }

    6% {
      transform: translate(8px, 0) rotate(0);
    }

    8% {
      transform: translate(9px, 0) rotate(0);
    }

    10% {
      transform: translate(-7px, 0) rotate(0);
    }

    12% {
      transform: translate(1px, 0) rotate(0);
    }

    14% {
      transform: translate(-4px, 0) rotate(0);
    }

    16% {
      transform: translate(7px, 0) rotate(0);
    }

    18% {
      transform: translate(8px, 0) rotate(0);
    }

    20% {
      transform: translate(-7px, 0) rotate(0);
    }

    22% {
      transform: translate(9px, 0) rotate(0);
    }

    24% {
      transform: translate(8px, 0) rotate(0);
    }

    26% {
      transform: translate(-2px, 0) rotate(0);
    }

    28% {
      transform: translate(5px, 0) rotate(0);
    }

    30% {
      transform: translate(6px, 0) rotate(0);
    }

    32% {
      transform: translate(4px, 0) rotate(0);
    }

    34% {
      transform: translate(3px, 0) rotate(0);
    }

    36% {
      transform: translate(7px, 0) rotate(0);
    }

    38% {
      transform: translate(-1px, 0) rotate(0);
    }

    40% {
      transform: translate(3px, 0) rotate(0);
    }

    42% {
      transform: translate(10px, 0) rotate(0);
    }

    44% {
      transform: translate(3px, 0) rotate(0);
    }

    46% {
      transform: translate(-9px, 0) rotate(0);
    }

    48% {
      transform: translate(6px, 0) rotate(0);
    }

    50% {
      transform: translate(-8px, 0) rotate(0);
    }

    52% {
      transform: translate(6px, 0) rotate(0);
    }

    54% {
      transform: translate(1px, 0) rotate(0);
    }

    56% {
      transform: translate(5px, 0) rotate(0);
    }

    58% {
      transform: translate(-4px, 0) rotate(0);
    }

    60% {
      transform: translate(3px, 0) rotate(0);
    }

    62% {
      transform: translate(-5px, 0) rotate(0);
    }

    64% {
      transform: translate(7px, 0) rotate(0);
    }

    66% {
      transform: translate(-8px, 0) rotate(0);
    }

    68% {
      transform: translate(-2px, 0) rotate(0);
    }

    70% {
      transform: translate(-5px, 0) rotate(0);
    }

    72% {
      transform: translate(1px, 0) rotate(0);
    }

    74% {
      transform: translate(1px, 0) rotate(0);
    }

    76% {
      transform: translate(-9px, 0) rotate(0);
    }

    78% {
      transform: translate(6px, 0) rotate(0);
    }

    80% {
      transform: translate(8px, 0) rotate(0);
    }

    82% {
      transform: translate(10px, 0) rotate(0);
    }

    84% {
      transform: translate(-6px, 0) rotate(0);
    }

    86% {
      transform: translate(-1px, 0) rotate(0);
    }

    88% {
      transform: translate(5px, 0) rotate(0);
    }

    90% {
      transform: translate(-1px, 0) rotate(0);
    }

    92% {
      transform: translate(7px, 0) rotate(0);
    }

    94% {
      transform: translate(-3px, 0) rotate(0);
    }

    96% {
      transform: translate(-7px, 0) rotate(0);
    }

    98% {
      transform: translate(-4px, 0) rotate(0);
    }

    0%,
    100% {
      transform: translate(0, 0) rotate(0);
    }
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
