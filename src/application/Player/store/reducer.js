import * as actionTypes from './constants';
import { fromJS } from 'immutable';
import { playMode } from './../../../api/config';
import { findIndex } from '../../../api/utils';//注意引入工具方法

const handleDeleteSong = (state, song) => {
  //也可用loadsh库的deepClone方法。这里深拷贝是基于纯函数的考虑，不对参数state做修改
  const playList = JSON.parse(JSON.stringify(state.get('playList').toJS()));
  const sequenceList = JSON.parse(JSON.stringify(state.get('sequencePlayList').toJS()));
  let currentIndex = state.get('currentIndex');
  // 找对应歌曲在播放列表中的索引
  const fpIndex = findIndex(song, playList);
  // 在播放列表中将其删除
  playList.splice(fpIndex, 1);
  // 如果删除的歌曲排在当前播放歌曲前面，那么currentIndex--，让当前的歌正常播放
  if(fpIndex < currentIndex) currentIndex--;
  
  //在sequenceList中直接删除歌曲即可
  const fsIndex = findIndex(song, sequenceList);
  sequenceList.splice(fsIndex, 1);

  return state.merge({
    'playList': fromJS(playList),
    'sequencePlayList': fromJS(sequenceList),
    'currentIndex': fromJS(currentIndex),
  });
}
const defaultState = fromJS({
  fullScreen: false,//播放器是否为全屏模式
  playing: false, //当前歌曲是否播放
  sequencePlayList: [], //顺序列表(因为之后会有随机模式，列表会乱序，因从拿这个保存顺序列表)
  playList: [],
  mode: playMode.sequence,//播放模式
  currentIndex: 0,//当前歌曲在播放列表的索引位置
  showPlayList: false,//是否展示播放列表
  currentSong: {} 
});

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
    case actionTypes.DELETE_SONG:
      return handleDeleteSong(state, action.data);
    default:
      return state;
  }
}