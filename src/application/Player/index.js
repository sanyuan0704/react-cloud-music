import React, {useRef, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  MiniPlayer,
  NormalPlayer,
  Top,
  Middle,
  Bottom,
  ProgressWrapper,
  Operators,
  CDWrapper,
  LyricContainer,
  LyricWrapper,
} from './style';
import { CSSTransition } from "react-transition-group";
import ProgressCircle from './../../baseUI/progress-circle/index';
import {
  changePlayingState,
  // changeFullScreen,
  changeShowPlayList,
  changeCurrentIndex,
  changeCurrentSong,
  changePlayList,
  changePlayMode
} from './store/actionCreators';
import { getName, isEmptyObject, shuffle, findIndex } from '../../api/utils';
import animations from 'create-keyframe-animation';
import { prefixStyle, formatPlayTime } from './../../api/utils';
import ProgressBar from '../../baseUI/progress-bar/index';
import PlayList from './play-list/index';
import { playMode } from './../../api/config';
import Toast from './../../baseUI/toast/index';
import Scroll from './../../baseUI/scroll/index';
import { getLyricRequest } from './../../api/request';
import Lyric from '../../api/lyric-parser';


function Player(props) {
  const [full, setFull] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [modeText, setModeText] = useState('');
  const [currentPlayingLyric, setPlayingLyric] = useState('');
  let percent = isNaN(currentTime/duration) ? 0  :currentTime/duration;

  console.log(currentPlayingLyric)
  const {
    playing,
    currentSong,
    currentIndex,
    playList,
    mode,
    sequencePlayList,
    // fullScreen
  } = props;

  const {
    togglePlayingDispatch,
    togglePlayListDispatch,
    changeCurrentIndexDispatch,
    changeCurrentDispatch,
    changePlayListDispatch,
    changeModeDispatch
  } = props;

  const cdWrapperRef = useRef();
  const cdImageRef = useRef();
  const miniWrapperRef = useRef();
  const miniImageRef = useRef();
  const lyricLineRefs = useRef([]);

  const songReady = useRef(true);
  const currentLyric = useRef();
  const currentLineNum = useRef(0);
  const currentState = useRef(0);

  const song = currentSong;

  const [preSong, setPreSong] = useState({}); 

  //处理transform的浏览器兼容问题
  const transform = prefixStyle('transform');

  const audioRef = useRef();
  const normalPlayerRef = useRef();
  const miniPlayerRef = useRef();  
  const toastRef = useRef();
  const lyricScrollRef = useRef();

  useEffect(() => {
    if(!playList.length || currentIndex === -1 || !playList[currentIndex] || playList[currentIndex].id === preSong.id) return;
    if(!songReady.current){
      alert("操作过快！")
      return;
    } 
    songReady.current = false;
    let current = playList[currentIndex];
    changeCurrentDispatch(current);
    setPreSong(current);
    audioRef.current.src = `https://music.163.com/song/media/outer/url?id=${current.id}.mp3`;
    setTimeout(() => {
      songReady.current = true;
    }, 1000);
    togglePlayingDispatch(true);
    getLyric(current.id);
    setCurrentTime(0);
    setDuration(current.dt/1000 | 0);
    // eslint-disable-next-line
  }, [currentIndex, playList]);

  useEffect(() => {
    playing ? audioRef.current.play() : audioRef.current.pause();
  }, [playing]);

  const handleLyric = ({lineNum, txt}) => {
    if(!lyricScrollRef.current) return;
    currentLineNum.current = lineNum;
    setPlayingLyric(txt);
    let bScroll = lyricScrollRef.current.getBScroll();
    if(lineNum > 5) {
      let lineEl = lyricLineRefs.current[lineNum - 5];
      bScroll.scrollToElement(lineEl, 1000);
    }
  }

  const getLyric = (id) => {
    let lyric = '';
    if(currentLyric.current) {
      currentLyric.current.stop();
    }
    getLyricRequest(id).then(data => {
      if(!data.lrc)return;
      lyric = data.lrc.lyric;
      audioRef.current.play();
      currentLyric.current = new Lyric(lyric, handleLyric);
      currentLyric.current.play();
      currentLyric.current.seek(0);
    }).catch(() => {
      audioRef.current.play();
    })
  };

  const _getPosAndScale = () => {
    const targetWidth = 40;
    const paddingLeft = 40;
    const paddingBottom = 30;
    const paddingTop = 80;
    const width = window.innerWidth * 0.8;
    const scale = targetWidth/width;
    // 两个圆心的横坐标距离和纵坐标距离
    const x = -(window.innerWidth / 2 - paddingLeft);
    const y = window.innerHeight - paddingTop - width/2 -paddingBottom;
    return {
      x,
      y,
      scale
    };
  }
  
  const enter = () => {
    normalPlayerRef.current.style.display = 'block';
    const {x, y, scale} = _getPosAndScale();
    let animation = {
      0: {
        transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
      },
      60: {
        transform: `translate3d(0, 0, 0) scale(1.1)`
      },
      100: {
        transform: `translate3d(0, 0, 0) scale(1)`
      }
    };
    animations.registerAnimation({
      name: 'move',
      animation,
      presets: {
        duration: 400,
        easing: 'linear'
      }
    });
    animations.runAnimation(cdWrapperRef.current, 'move');
  }

  const afterEnter = () => {
    const cdWrapperDom = cdWrapperRef.current;
    animations.unregisterAnimation('move');
    cdWrapperDom.style.animation = '';
    //以下同步歌词的位置
    if(currentLineNum.current && currentLyric.current.lines.length) {
      handleLyric({
        lineNum: currentLineNum.current, 
        txt: currentLyric.current.lines[currentLineNum.current].txt
      }); 
    }
  };

  const leave = () => {
    if(!cdWrapperRef.current) return;
    const cdWrapperDom = cdWrapperRef.current;
    cdWrapperDom.style.transition = 'all 0.4s';
    const {x, y, scale} = _getPosAndScale();
    cdWrapperDom.style[transform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
  }

  const afterLeave = () => {
    if(!cdWrapperRef.current) return;
    const cdWrapperDom = cdWrapperRef.current;
    cdWrapperDom.style.transition = ''
    cdWrapperDom.style[transform] = '';
    normalPlayerRef.current.style.display = 'none';
  }


  const clickPlaying = (e, state) => {
    e.stopPropagation();
    togglePlayingDispatch(state);
    currentLyric.current.togglePlay();
  }

  const onProgressChange = (curPercent) => {
    const newTime = curPercent*duration;
    setCurrentTime(newTime);
    audioRef.current.currentTime = newTime;
    if(!playing) {
      togglePlayingDispatch(true);
    }
    if(currentLyric.current) {
      currentLyric.current.seek(newTime * 1000);
    }
  }

  const updateTime = (e) => {
    setCurrentTime(e.target.currentTime);
  };

  const handleLoop = () => {
    audioRef.current.currentTime =  0;
    changePlayingState(true);
    audioRef.current.play();
    if(currentLyric.current) {
      currentLyric.current.seek(0);
    }
  }

  const handlePrev = () => {
    if(playList.length === 1) {
      handleLoop();
      return;
    }
    let index = currentIndex - 1;
    if(index === 0) index = playList.length - 1;
    if(!playing) togglePlayingDispatch(true);
    changeCurrentIndexDispatch(index);
  }

  const handleNext = () => {
    if(playList.length === 1) {
      handleLoop();
      return;
    }
    let index = currentIndex + 1;
    if(index === playList.length) index = 0;
    if(!playing) togglePlayingDispatch(true);
    changeCurrentIndexDispatch(index);
  }

  const handleEnd = () => {
    if(mode === playMode.loop){
      handleLoop();
    } else {
      handleNext();
    }
  }

  const getPlayMode = () => {
    let content;
    if(mode === playMode.sequence) {
      content = "&#xe625;";
    } else if(mode === playMode.loop) {
      content = "&#xe653;";
    } else {
      content = "&#xe61b;";
    }
    return content;
  }

  const changeMode = () => {
    let newMode = (mode + 1)%3;
    if(newMode === 0){
      //顺序模式
      changePlayListDispatch(sequencePlayList);
      let index = findIndex(currentSong, sequencePlayList);
      changeCurrentIndexDispatch(index);
      setModeText("顺序循环");
    }else if(newMode === 1){
      //单曲循环
      changePlayListDispatch(sequencePlayList);
      setModeText("单曲循环");
    } else if(newMode === 2) {
      //随机播放
      let newList = shuffle(sequencePlayList);
      let index = findIndex(currentSong, newList);
      changePlayListDispatch(newList);
      changeCurrentIndexDispatch(index);
      setModeText("随机播放");
    }
    changeModeDispatch(newMode);
    toastRef.current.show();
  }
  const handleError = () => {
    alert("播放出错");
  }
  
  const toggleCurrentState = () => {
    if(currentState.current !== 'lyric') {
    console.log("geci ")
      currentState.current = 'lyric';
    } else {
      currentState.current = '';
    }
  }
  const normalPlayer = () => {
    const song = currentSong;
    if(isEmptyObject(song)) return;
    return (
      <CSSTransition  
        classNames="normal"
        in={full} 
        timeout={400}
        mountOnEnter
        onEnter={enter}
        onEntered={afterEnter}
        onExit={leave}
        onExited={afterLeave}
      >
        <NormalPlayer ref={normalPlayerRef}>
          <div className="background">
            <img src={song.al.picUrl + "?param=300x300"} width="100%" height="100%" alt="歌曲图片"/>
          </div>
          <div className="background layer"></div>
          <Top className="top">
            <div className="back" onClick={() => setFull(false)}>
              <i className="iconfont icon-back">&#xe662;</i>
            </div>
            <h1 className="title">{song.name}</h1>
            <h1 className="subtitle">{getName(song.ar)}</h1>
          </Top>
          <Middle ref={cdWrapperRef} onClick={toggleCurrentState}>
            <CSSTransition
             timeout={400}
             classNames="fade" 
             in={currentState.current !== 'lyric'} 
            >
              <CDWrapper 
                style={{visibility: currentState.current !== 'lyric'? 'visible': 'hidden'}}
              >
                <div className="cd">
                  <img ref={cdImageRef} className={`image play ${playing ? "": "pause"}`} src={song.al.picUrl + "?param=400x400"} alt=""/>
                </div>
                <p className="playing_lyric">{currentPlayingLyric}</p>
              </CDWrapper>
            </CSSTransition>
            <CSSTransition
              timeout={400}
              classNames="fade" 
              in={currentState.current === 'lyric'} 
            >
              <LyricContainer>
                <Scroll ref={lyricScrollRef} >
                  <LyricWrapper 
                    style={{visibility: currentState.current === 'lyric'? 'visible': 'hidden'}}
                    className="lyric_wrapper" 
                  >
                    {
                      currentLyric.current ?
                      currentLyric.current.lines.map((item, index) => {
                        return (
                          <p 
                            className={`text ${currentLineNum.current===index ? 'current' : ''}`} 
                            key={item+index} 
                            ref={el => lyricLineRefs.current.push(el) }>
                            {item.txt}
                          </p>
                        ) 
                      })
                      : null
                    }
                  </LyricWrapper>
                </Scroll>
              </LyricContainer>
            </CSSTransition>
          </Middle>
          <Bottom className="bottom">
            <ProgressWrapper>
              <span className="time time-l">{formatPlayTime(currentTime)}</span>
              <div className="progress-bar-wrapper">
                <ProgressBar percent={percent} percentChange={onProgressChange}></ProgressBar>
              </div>
              <div className="time time-r">{formatPlayTime(duration)}</div>
            </ProgressWrapper>
            <Operators>
              <div className="icon i-left" onClick={changeMode}>
                <i className="iconfont" dangerouslySetInnerHTML={{__html: getPlayMode()}}></i>
              </div>
              <div className="icon i-left" onClick={handlePrev}>
                <i className="iconfont">&#xe6e1;</i>
              </div>
              <div className="icon i-center">
                <i className="iconfont" 
                  onClick={(e) => clickPlaying(e, !playing)} 
                  dangerouslySetInnerHTML={{__html: playing?"&#xe723;":"&#xe731;"}}>
                </i>
              </div>
              <div className="icon i-right" onClick={handleNext}>
                <i className="iconfont">&#xe718;</i>
              </div>
              <div className="icon i-right" onClick={() => togglePlayListDispatch(true)}>
                <i className="iconfont">&#xe640;</i>
              </div>
            </Operators>
          </Bottom>
          <Toast text={modeText} ref={toastRef}></Toast>
        </NormalPlayer>
      </CSSTransition>
    )
  }


  const miniPlayer = () => {
    if(isEmptyObject(song)) return;
    return (
      <CSSTransition 
        in={!full} 
        timeout={400} 
        classNames="mini" 
        onEnter={() => miniPlayerRef.current.style.display = "flex"}
        onExited={() => miniPlayerRef.current.style.display = "none"}
      >
        <MiniPlayer ref={miniPlayerRef} onClick={(e) => setFull(true)}>
          <div className="icon">
            <div className="imgWrapper" ref={miniWrapperRef}>
              <img className={`play ${playing ? "": "pause"}`} ref={miniImageRef} src={song.al.picUrl} width="40" height="40" alt="img"/>
            </div>
          </div>
          <div className="text">
            <h2 className="name">{song.name}</h2>
            <p className="desc">{getName(song.ar)}</p>
          </div>
          <div className="control">
            <ProgressCircle radius={32} percent={percent}>
              { playing ? 
                <i className="icon-mini iconfont icon-pause" onClick={(e) => clickPlaying(e, false)}>&#xe650;</i>
                :
                <i className="icon-mini iconfont icon-play" onClick={(e) => clickPlaying(e, true)}>&#xe61e;</i> 
              }
            </ProgressCircle>
          </div>
          <div className="control" onClick={(e) => { togglePlayListDispatch(true); e.stopPropagation();}}>
            <i className="iconfont">&#xe640;</i>
          </div>
        </MiniPlayer>
      </CSSTransition>
    )
  }

  return (
    <div>
      {normalPlayer()}
      {miniPlayer()}
      <PlayList></PlayList>
      <audio 
        ref={audioRef} 
        onTimeUpdate={updateTime}
        onEnded={handleEnd}
        onError={handleError}
      ></audio>
    </div>
  )
}

// 映射Redux全局的state到组件的props上
const mapStateToProps = (state) => ({
  fullScreen: state.getIn(['player', 'fullScreen']),
  playing: state.getIn(['player', 'playing']),
  currentSong: state.getIn(['player', 'currentSong']).toJS(),
  showPlayList: state.getIn(['player', 'showPlayList']),
  mode: state.getIn(['player', 'mode']),
  currentIndex: state.getIn(['player', 'currentIndex']),
  playList: state.getIn(['player', 'playList']).toJS(),
  sequencePlayList: state.getIn(['player', 'sequencePlayList'])
});

// 映射dispatch到props上
const mapDispatchToProps = (dispatch) => {
  return {
    togglePlayingDispatch(data) {
      dispatch(changePlayingState(data));
    },
    // toggleFullScreenDispatch(data) {
    //   dispatch(changeFullScreen(data))
    // },
    togglePlayListDispatch(data) {
      dispatch(changeShowPlayList(data));
    },
    changeCurrentIndexDispatch(index) {
      dispatch(changeCurrentIndex(index));
    },
    changeCurrentDispatch(data) {
      dispatch(changeCurrentSong(data));
    },
    changeModeDispatch(data) {
      dispatch(changePlayMode(data));
    },
    changePlayListDispatch(data) {
      dispatch(changePlayList(data));
    }
  }
};

// 将ui组件包装成容器组件
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Player));