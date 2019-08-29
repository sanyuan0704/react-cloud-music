import React, {useRef, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  changePlayingState,
  changeShowPlayList,
  changeCurrentIndex,
  changeCurrentSong,
  changePlayList,
  changePlayMode,
  changeFullScreen
} from './store/actionCreators';
import { isEmptyObject, shuffle, findIndex, getSongUrl } from '../../api/utils';
import PlayList from './play-list/index';
import Toast from './../../baseUI/toast/index';
import Lyric from '../../api/lyric-parser';
import MiniPlayer from './mini-player'
import NormalPlayer from './normal-player';
import { playMode } from './../../api/config';
import { getLyricRequest } from './../../api/request';

function Player(props) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentPlayingLyric, setPlayingLyric] = useState('');
  const [modeText, setModeText] = useState('');

  let percent = isNaN(currentTime/duration) ? 0  :currentTime/duration;

  const {
    playing,
    currentSong,
    currentIndex,
    playList,
    mode,
    sequencePlayList,
    fullScreen
  } = props;

  const {
    togglePlayingDispatch,
    togglePlayListDispatch,
    changeCurrentIndexDispatch,
    changeCurrentDispatch,
    changePlayListDispatch,
    changeModeDispatch,
    toggleFullScreenDispatch
  } = props;

  const [preSong, setPreSong] = useState({}); 

  const audioRef = useRef();
  const toastRef = useRef();

  const currentLyric = useRef();
  const currentLineNum = useRef(0);
  const songReady = useRef(true);

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
    audioRef.current.src = getSongUrl(current.id);
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

  useEffect(() => {
    if(!fullScreen) return;
    if(currentLineNum.current && currentLyric.current.lines.length) {
      handleLyric({
        lineNum: currentLineNum.current, 
        txt: currentLyric.current.lines[currentLineNum.current].txt
      }); 
    }
  }, [fullScreen]);

  const handleLyric = ({lineNum, txt}) => {
    currentLineNum.current = lineNum;
    setPlayingLyric(txt);
  };

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
      currentLineNum.current = 0;
      currentLyric.current.seek(0);
    }).catch(() => {
      audioRef.current.play();
    })
  };

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
  return (
    <div>
      {
        isEmptyObject(currentSong) ? null :
        <NormalPlayer
          song={currentSong}
          full={fullScreen}
          playing={playing}
          mode={mode}
          percent={percent}
          modeText={modeText}
          duration={duration}
          currentTime={currentTime}
          currentLyric={currentLyric.current}
          currentPlayingLyric={currentPlayingLyric}
          changeMode={changeMode}
          handlePrev={handlePrev}
          handleNext={handleNext}
          onProgressChange={onProgressChange}
          currentLineNum={currentLineNum.current}
          clickPlaying={clickPlaying}
          toggleFullScreenDispatch={toggleFullScreenDispatch}
          togglePlayListDispatch={togglePlayListDispatch}
        >
        </NormalPlayer>
      }
      {
        isEmptyObject(currentSong) ? null :
        <MiniPlayer
          playing={playing}
          full={fullScreen}
          song={currentSong}
          percent={percent}
          clickPlaying={clickPlaying}
          setFullScreen={toggleFullScreenDispatch}
          togglePlayList={togglePlayListDispatch}
        ></MiniPlayer>
      }

      <PlayList></PlayList>
      <audio 
        ref={audioRef} 
        onTimeUpdate={updateTime}
        onEnded={handleEnd}
        onError={handleError}
      ></audio>
      <Toast text={modeText} ref={toastRef}></Toast>
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
    toggleFullScreenDispatch(data) {
      dispatch(changeFullScreen(data));
    },
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