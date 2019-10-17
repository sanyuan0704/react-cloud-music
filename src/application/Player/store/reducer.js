import * as actionTypes from './constants';
import { fromJS } from 'immutable';
import { playMode } from './../../../api/config';
import { findIndex } from '../../../api/utils';

const defaultState = fromJS({
  fullScreen: false,
  playing: false,
  sequencePlayList: [],
  playList: [],
  mode: playMode.sequence,
  currentIndex: -1,
  showPlayList: false,
  currentSong: {},
  speed: 1
});

const handleInsertSong = (state, song) => {
  const playList = JSON.parse(JSON.stringify(state.get('playList').toJS()));
  const sequenceList = JSON.parse(JSON.stringify(state.get('sequencePlayList').toJS()));
  let currentIndex = state.get('currentIndex');
  //看看有没有同款
  let fpIndex = findIndex(song, playList);
  // 如果是当前歌曲直接不处理
  if(fpIndex === currentIndex && currentIndex !== -1) return state;
  currentIndex++;
  // 把歌放进去,放到当前播放曲目的下一个位置
  playList.splice(currentIndex, 0, song);
  // 如果列表中已经存在要添加的歌
  if(fpIndex > -1) {
    if(currentIndex > fpIndex) {
      playList.splice(fpIndex, 1);
      currentIndex--;
    } else {
      playList.splice(fpIndex+1, 1);
    }
  }

  let sequenceIndex = findIndex(playList[currentIndex], sequenceList) + 1;
  let fsIndex = findIndex(song, sequenceList);
  sequenceList.splice(sequenceIndex, 0, song);
  if(fsIndex > -1) {
    if(sequenceIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1);
      sequenceIndex--;
    } else {
      sequenceList.splice(fsIndex + 1, 1);
    }
  }
  return state.merge({
    'playList': fromJS(playList),
    'sequencePlayList': fromJS(sequenceList),
    'currentIndex': fromJS(currentIndex),
  });
}

const handleDeleteSong = (state, song) => {
  const playList = JSON.parse(JSON.stringify(state.get('playList').toJS()));
  const sequenceList = JSON.parse(JSON.stringify(state.get('sequencePlayList').toJS()));
  let currentIndex = state.get('currentIndex');

  const fpIndex = findIndex(song, playList);
  playList.splice(fpIndex, 1);
  if(fpIndex < currentIndex) currentIndex--;
  
  const fsIndex = findIndex(song, sequenceList);
  sequenceList.splice(fsIndex, 1);

  return state.merge({
    'playList': fromJS(playList),
    'sequencePlayList': fromJS(sequenceList),
    'currentIndex': fromJS(currentIndex),
  });
}


export default (state = defaultState, action) => {
  switch(action.type) {
    case actionTypes.SET_CURRENT_SONG:
      return state.set('currentSong', action.data);
    case actionTypes.SET_FULL_SCREEN:
      return state.set('fullScreen', action.data);
    case actionTypes.SET_PLAYING_STATE:
      return state.set('playing', action.data);
    case actionTypes.SET_SEQUECE_PLAYLIST:
      return state.set('sequencePlayList', action.data);
    case actionTypes.SET_PLAYLIST:
      return state.set('playList', action.data);
    case actionTypes.SET_PLAY_MODE:
      return state.set('mode', action.data);
    case actionTypes.SET_CURRENT_INDEX:
      return state.set('currentIndex', action.data);
    case actionTypes.SET_SHOW_PLAYLIST:
      return state.set('showPlayList', action.data);
    case actionTypes.INSERT_SONG:
      return handleInsertSong(state, action.data);
    case actionTypes.DELETE_SONG:
      return handleDeleteSong(state, action.data);
    case actionTypes.CHANGE_SPEED:
      return state.set('speed', action.data);
    default:
      return state;
  }
}