import React, { useState, useRef, useEffect } from "react";
import { VcodeBox, Container } from "./style";

const maxLength = 4;
const sentPeriod = 60;
let theTimer;
const StepTwo = props => {
  const { phone, triggerLogin, reSentVcode } = props;
  const [cursorIndex, setCursorIndex] = useState(0);
  const [vcode, setVcode] = useState("");
  const [timer, setTimer] = useState(sentPeriod);
  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.focus();
    if (timer === 0) {
      clearInterval(theTimer);
    }
    if (timer !== sentPeriod) {
      return;
    }
    theTimer = setInterval(() => {
      setTimer(timer => timer - 1);
    }, 1000);
    return () => {
      clearTimeout(theTimer);
    }
  }, [timer]);

  useEffect(() => {
    if (vcode.length === 4) {
      triggerLogin(vcode);
    }
  }, [vcode, triggerLogin]);

  const onChangeVcode = e => {
    if (!e.target.value) return;
    const val = e.target.value;
    setVcode(val);
    setCursorIndex(val.split("").length);
  };

  const onClickSentVcode = () => {
    reSentVcode();
    setTimer(sentPeriod);
  };

  return (
    <Container>
      <p className="tips">&emsp;&emsp;验证码已发送至</p>
      <p className="vphone">
        <span>
          {phone.replace(/(\d{3})\s(\d{4})\s(\d{4})/g, "+86 $1 **** $3")}
        </span>
        {timer ? (
          <span>{timer}S</span>
        ) : (
          <span className="sentBtn" onClick={onClickSentVcode}>
            重新发送
          </span>
        )}
      </p>
      <VcodeBox>
        <h2 className="heading-2">验证码:</h2>
        <div className="v-code">
          <input
            id="vcode"
            type="tel"
            maxLength={maxLength}
            ref={inputRef}
            value={vcode}
            onChange={onChangeVcode}
          />
          {[...Array(maxLength)].map((_, idx) => (
            <label
              htmlFor="vcode"
              key={idx}
              className={`line ${cursorIndex === idx ? "animated" : ""}`}
            >
              {vcode[idx]}
            </label>
          ))}
        </div>
      </VcodeBox>
    </Container>
  );
};

export default StepTwo;
