import styled from 'styled-components';
import style from '../../assets/global-style';

export const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: ${props => props.play > 0 ? "60px": 0};
  width: 100%;
  z-index: 100;
  overflow: hidden;
  background: #f2f3f4;
  transform-origin: right bottom;
  &.fly-enter, &.fly-appear{
    transform: rotateZ(30deg) translate3d(100%, 0, 0);
  }
  &.fly-enter-active, &.fly-appear-active{
    transition: transform .3s;
    transform: rotateZ(0deg) translate3d(0, 0, 0);
  }
  &.fly-exit{
    transform: rotateZ(0deg) translate3d(0, 0, 0);
  }
  &.fly-exit-active{
    transition: transform .3s;
    transform: rotateZ(30deg) translate3d(100%, 0, 0);
  }
`
export const TopDesc = styled.div`
  background-size: 100%;
  padding: 5px 20px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  box-sizing: border-box;
  width: 100%;
  height: 200px;
  position: relative;
  z-index: 100;
  .background{
    /* z-index: -1; */
    background: url(${props => props.background}) left top no-repeat;

    position: absolute;
    width: 100%;
    height: 100%;
    filter: blur(20px);
    transform: scale(1.5);
  }
  .img_wrapper{
    width: 120px;
    height: 120px;
    position: relative;         
    .decorate {
      position: absolute;
      top: 0;
      width: 100%;
      height: 35px;
      border-radius: 3px;
      background: linear-gradient(hsla(0,0%,43%,.4),hsla(0,0%,100%,0));
    }
    .play_count {
      position: absolute;
      right: 2px;
      top: 2px;
      font-size: ${style["font-size-s"]};
      line-height: 15px;
      color: ${style["font-color-light"]};
      .play{
        vertical-align: top;
      }
    }
    img{
      width: 120px;
      height: 120px;
      border-radius:3px;
    }
  }
  .desc_wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 120px;
    padding: 0 10px;
    .title{
      max-height: 70px;
      overflow: hidden;
      text-overflow: ellipsis;
      color: ${style["font-color-desc"]};
      font-weight: 700;
      line-height: 1.5;
      font-size: ${style["font-size-l"]};
    }
    .person{
      display: flex;
      .avatar{
        width: 20px;
        height: 20px;
        margin-right: 5px;
        img{
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .name {
        line-height: 20px;
        font-size: ${style["font-size-m"]};
        color: ${style["font-color-desc"]};
      }
    }
  }
`

export const Menu = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  margin: 0 30px;
  margin-top: -20px;
  margin-bottom: 10px;
  >div {
    display: flex;
    flex-direction: column;
    line-height: 20px;
    text-align: center;
    font-size: ${style["font-size-s"]};
    color: #3b1f1f;
    color: ${style["font-color-desc"]};
    z-index:1000;
    font-weight: 500;
    .iconfont {
      font-size: 20px;
    }
  }
`

export const SongList = styled.div`
  border-radius: 10px;
  opacity: 0.98;
  .first_line{
    box-sizing: border-box;
    padding: 10px 0;
    margin-left: 10px;
    position: relative;
    justify-content: space-between;
    border-bottom: 1px solid ${style["border-color"]};
    .play_all{
      display: inline-block;
      line-height: 24px;
      color: ${style["font-color-desc"]};
      .iconfont {
        font-size: 24px;
        margin-right: 10px;
        vertical-align: top;
      }
      .sum{
        font-size: ${style["font-size-s"]};
        color: ${style["font-color-desc-v2"]};
      }
      >span{
        vertical-align: top;
      }
    }
    .add_list {
      display: flex;
      align-items: center;
      position: absolute;
      right: 0; top :0px; bottom: 0;
      width: 130px;
      line-height: 34px;
      background: ${style["theme-color"]};
      color: ${style["font-color-light"]};
      font-size: 0;
      border-radius: 3px;
      vertical-align: top;
      .iconfont {
        vertical-align: top;
        font-size: 10px;
        margin: 0 5px 0 10px;
      }
      span{
        font-size: 14px;
        line-height: 34px;
      }
  }
}
`
export const SongItem = styled.ul`
  >li{
    display: flex;
    height: 60px;
    align-items: center;  
    .index{
      width: 60px;
      height: 60px;
      line-height: 60px;
      text-align: center;
    }
    .info{
      box-sizing: border-box;
      flex: 1;
      display: flex;
      height: 100%;
      padding: 5px 0;
      flex-direction: column;
      justify-content: space-around;
      border-bottom: 1px solid ${style["border-color"]};
      >span:first-child{
        color: ${style["font-color-desc"]};
      }
      >span:last-child{
        font-size: ${style["font-size-s"]};
        color: #bba8a8;
      }
    }
  }
`


