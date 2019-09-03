import React, { useState, useRef, useEffect } from "react";
import { VcodeBox, Container } from "./style";

const maxLength = 4;
const StepTwo = props => {
  const { phone, triggerLogin } = props;
  const [cursorIndex, setCursorIndex] = useState(0);
  const [vcode, setVcode] = useState("");
  const [timer, setTimer] = useState(60);
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.focus();
    let theTimer;
    if (!theTimer) {
      theTimer = setInterval(() => {
        setTimer(timer => timer - 1);
      }, 1000);
    }
    return () => {
      clearTimeout(theTimer);
    };
  }, [vcode]);

  useEffect(() => {
    if (vcode.length === 4) {
      triggerLogin(vcode);
    }
  }, [vcode, triggerLogin]);

  const onChangeVcode = e => {
    const val = e.target.value;
    if (!val) {
      return;
    }
    setVcode(val);
    setCursorIndex(val.split("").length);
  };

  return (
    <Container>
      <p className="tips">&emsp;&emsp;验证码已发送至</p>
      <p className="vphone">
        <span>
          {phone.replace(/(\d{3})\s(\d{4})\s(\d{4})/g, "+86 $1 **** $3")}
        </span>
        <span>{timer}S</span>
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
              {vcode.split("")[idx]}
            </label>
          ))}
        </div>
      </VcodeBox>
    </Container>
  );
};

export default StepTwo;
