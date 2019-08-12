import styled, {keyframes} from 'styled-components';
import style from '../../assets/global-style';

const rotate = keyframes`
  0%{
    transform: rotate(0);
  }
  100%{
    transform: rotate(360deg);
  }
`

export const NormalPlayer = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 150;
  background: ${style["background-color"]};
  .background {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    opacity: 0.6;
    filter: blur(20px);
  }
  &.normal-enter, &.normal-exit-done{
    .top{
      transform: translate3d(0, -100px, 0);
    }
    .bottom{
      transform: translate3d(0, 100px, 0);
    }
  }
  &.normal-enter-active, &.normal-exit-active{
    .top, .bottom{
      transform: translate3d(0, 0, 0);
      transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
    }
    opacity: 1;
    transition: all 0.4s;
  }
  &.normal-exit-active{
    opacity: 0;
  }
`

export const Top = styled.div`
  position: relative;
  margin-bottom: 25px;
  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 50;
    .iconfont {
      display: block;
      padding: 9px;
      font-size: 24px;
      color: ${style["font-color-desc"]};
      font-weight: bold;
      transform: rotate(90deg);
    }
  }
  .title {
    width: 70%;
    margin: 0 auto;
    line-height: 40px;
    text-align: center;
    font-size: ${style["font-size-l"]};
    color: ${style["font-color-desc"]};
  }
  .subtitle {
    line-height: 20px;
    text-align: center;
    font-size: ${style["font-size-m"]};;
    color: ${style["font-color-desc-v2"]};
  }
`

export const Middle = styled.div`
  position: fixed;
  width: 100%;
  top: 80px;
  bottom: 170px;
  white-space: nowrap;
  font-size: 0;
  >div{
    display: inline-block;
    vertical-align: top;
    position: relative;
    margin: auto;
    width: 100%;
    height: 0;
    padding-top: 80%;
  }
`
export const CDWrapper = styled.div`
  position: absolute;
  margin: auto;
  top: 10%; left: 0; right: 0;
  width: 80%;
  box-sizing: border-box;
  height: 100%;
  .cd {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    .image{
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      border-radius: 50%;
      border: 10px solid rgba(255, 255, 255, 0.1);
    }
    .play{
      animation: ${rotate} 20s linear infinite;
      &.pause{
        animation-play-state: paused;
      }
    }

  }
`

export const Bottom = styled.div`
  position: absolute;
  bottom: 50px;
  width: 100%;
`

export const ProgressWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 80%;
  margin: 0px auto;
  padding: 10px 0;
  .time{
    color: ${style["font-color-desc"]};
    font-size: ${style["font-size-s"]};
    flex: 0 0 30px;
    line-height: 30px;
    width: 30px;
    &.time-l{
      text-align: left;
    }
    &.time-r{
      text-align: right;
    }
  }
  .progress-bar-wrapper{
    flex: 1;
  }
`

export const Operators = styled.div`
  display: flex;
  align-items: center;
  .icon{
    font-weight: 300;
    flex: 1;
    color: ${style["font-color-desc"]};
    &.disable{
      color: ${style["theme-color-shadow"]};
    }
    i{
      font-weight: 300;
      font-size: 30px;
    }
  }
  .i-left{
    text-align: right;
  }
  .i-center{
    padding: 0 20px;
    text-align: center;
    i{
      font-size: 40px;
    }
  }
  .i-right{
    text-align: left;
  }
  .icon-favorite{
    color: ${style["theme-color"]};
  }
`

export const MiniPlayer = styled.div`
  display: flex;
  align-items: center;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 1000;
  width: 100%;
  height: 60px;
  background: ${style["highlight-background-color"]};
  &.mini-enter{
    transform: translate3d(0, 100%, 0);
  }
  &.mini-enter-active{
    transform: translate3d(0, 0, 0);
    transition: all 0.4s;
  }
  &.mini-exit-active{
    transform: translate3d(0, 100%, 0);
    transition: all .4s
  }
  .icon{
    flex: 0 0 40px;
    width: 40px;
    height: 40px;
    padding: 0 10px 0 20px;
    .imgWrapper{
      width: 100%;
      height: 100%;
      img{
        border-radius: 50%;
        &.play{
          animation: ${rotate} 10s infinite;
          &.pause{
            animation-play-state: paused;
          }
        }
      }
    }
  }
  .text{
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    line-height: 20px;
    overflow: hidden;
    .name{
      margin-bottom: 2px;
      font-size: ${style["font-size-m"]};
      color: ${style["font-color-desc"]};
      ${style.noWrap()}
    }
    .desc {
      font-size: ${style["font-size-s"]};
      color: ${style["font-color-desc-v2"]};
      ${style.noWrap()}
    }
  }
  .control{
    flex: 0 0 30px;
    padding: 0 10px;
    .iconfont, .icon-playlist{
      font-size: 30px;
      color: ${style["theme-color"]};
    }
    .icon-mini{
      font-size: 16px;
      position: absolute;
      left: 8px;
      top: 8px;
      &.icon-play{
        left: 9px
      }
    }
  }
`