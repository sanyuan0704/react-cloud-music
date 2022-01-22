import React, { useState, useEffect, useRef, useCallback } from "react";
import { Container } from "./style";
import Header from "../../baseUI/header/index";
import { ImgWrapper, CollectButton, SongListWrapper, BgLayer } from "./style";
import Scroll from "../../baseUI/scroll/index";
import { HEADER_HEIGHT } from "./../../api/config";
import { getSingerInfo } from "./store/actionCreators";
import { connect } from "react-redux";
import Loading from "./../../baseUI/loading/index";
import { EnterLoading } from "../Singers/style";
import { changeEnterLoading } from "./store/actionCreators";
import { CSSTransition } from "react-transition-group";
import SongsList from "../SongList/";
import MusicNote from "../../baseUI/music-note/index";

function Singer(props) {
  const initialHeight = useRef(0);
  const [showStatus, setShowStatus] = useState(true);

  const OFFSET = 5;

  const { 
    artist: immutableArtist, 
    songs: immutableSongs, 
    loading,
    songsCount
  } = props;

  const { getSingerDataDispatch } = props;

  const artist = immutableArtist.toJS();
  const songs = immutableSongs.toJS();

  const collectButton = useRef();
  const imageWrapper = useRef();
  const songScrollWrapper = useRef();
  const songScroll = useRef();
  const header = useRef();
  const layer = useRef();
  const musicNoteRef = useRef();

  useEffect(() => {
    const id = props.match.params.id;
    getSingerDataDispatch(id);
    let h = imageWrapper.current.offsetHeight;
    initialHeight.current = h;
    songScrollWrapper.current.style.top = `${h - OFFSET}px`;
    //把遮罩先放在下面，以裹住歌曲列表
    layer.current.style.top = `${h - OFFSET}px`;
    songScroll.current.refresh();
    // eslint-disable-next-line
  }, []);

  const handleScroll = pos => {
    let height = initialHeight.current;
    const newY = pos.y;
    const imageDOM = imageWrapper.current;
    const buttonDOM = collectButton.current;
    const headerDOM = header.current;
    const layerDOM = layer.current;
    const minScrollY = -(height - OFFSET) + HEADER_HEIGHT;

    const percent = Math.abs(newY / height);
    //说明: 在歌手页的布局中，歌单列表其实是没有自己的背景的，layerDOM其实是起一个遮罩的作用，给歌单内容提供白色背景
    //因此在处理的过程中，随着内容的滚动，遮罩也跟着移动
    if (newY > 0) {
      //处理往下拉的情况,效果：图片放大，按钮跟着偏移
      imageDOM.style["transform"] = `scale(${1 + percent})`;
      buttonDOM.style["transform"] = `translate3d(0, ${newY}px, 0)`;
      layerDOM.style.top = `${height - OFFSET + newY}px`;
    } else if (newY >= minScrollY) {
      //往上滑动，但是还没超过Header部分
      layerDOM.style.top = `${height - OFFSET - Math.abs(newY)}px`;
      layerDOM.style.zIndex = 1;
      imageDOM.style.paddingTop = "75%";
      imageDOM.style.height = 0;
      imageDOM.style.zIndex = -1;
      buttonDOM.style["transform"] = `translate3d(0, ${newY}px, 0)`;
      buttonDOM.style["opacity"] = `${1 - percent * 2}`;
    } else if (newY < minScrollY) {
      //往上滑动，但是超过Header部分
      layerDOM.style.top = `${HEADER_HEIGHT - OFFSET}px`;
      layerDOM.style.zIndex = 1;
      //防止溢出的歌单内容遮住Header
      headerDOM.style.zIndex = 100;
      //此时图片高度与Header一致
      imageDOM.style.height = `${HEADER_HEIGHT}px`;
      imageDOM.style.paddingTop = 0;
      imageDOM.style.zIndex = 99;
    }
  };

  const musicAnimation = (x, y) => {
    musicNoteRef.current.startAnimation({ x, y });
  };

  const setShowStatusFalse = useCallback(() => {
    setShowStatus(false);
  }, [])

  return (
    <CSSTransition
      in={showStatus}
      timeout={300}
      classNames="fly"
      appear={true}
      unmountOnExit
      onExited={() => props.history.goBack()}
    >
      <Container>
        <Header
          handleClick={setShowStatusFalse}
          title={artist.name}
          ref={header}
        ></Header>
        <ImgWrapper ref={imageWrapper} bgUrl={artist.picUrl}>
          <div className="filter"></div>
        </ImgWrapper>
        <CollectButton ref={collectButton}>
          <i className="iconfont">&#xe62d;</i>
          <span className="text">收藏</span>
        </CollectButton>
        <BgLayer ref={layer}></BgLayer>
        <SongListWrapper ref={songScrollWrapper} play={songsCount}>
          <Scroll onScroll={handleScroll} ref={songScroll}>
            <SongsList
              songs={songs}
              showCollect={false}
              usePageSplit={false}
              musicAnimation={musicAnimation}
            ></SongsList>
          </Scroll>
        </SongListWrapper>
        {loading ? (
          <EnterLoading style={{ zIndex: 100 }}>
            <Loading></Loading>
          </EnterLoading>
        ) : null}
        <MusicNote ref={musicNoteRef}></MusicNote>
      </Container>
    </CSSTransition>
  );
}

// 映射Redux全局的state到组件的props上
const mapStateToProps = state => ({
  artist: state.getIn(["singerInfo", "artist"]),
  songs: state.getIn(["singerInfo", "songsOfArtist"]),
  loading: state.getIn(["singerInfo", "loading"]),
  songsCount: state.getIn(["player", "playList"]).size
});
// 映射dispatch到props上
const mapDispatchToProps = dispatch => {
  return {
    getSingerDataDispatch(id) {
      dispatch(changeEnterLoading(true));
      dispatch(getSingerInfo(id));
    }
  };
};

// 将ui组件包装成容器组件
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(Singer));
