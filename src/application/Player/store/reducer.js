import * as actionTypes from './constants';
import { fromJS } from 'immutable';
import { playMode } from './../../../api/config';
import { findIndex } from '../../../api/utils';//注意引入工具方法

const handleInsertSong = (state, song) => {
  const playList = JSON.parse(JSON.stringify(state.get('playList').toJS()));
  const sequenceList = JSON.parse(JSON.stringify(state.get('sequencePlayList').toJS()));
  let currentIndex = state.get('currentIndex');
  //看看有没有同款
  console.log(song)
  let fpIndex = findIndex(song, playList);
  // 如果是当前歌曲直接不处理
  if(fpIndex === currentIndex && currentIndex !== -1) return state;
  currentIndex++;
  // 把歌放进去,放到当前播放曲目的下一个位置
  playList.splice(currentIndex, 0, song);
  // 如果列表中已经存在要添加的歌，暂且称它oldSong
  if(fpIndex > -1) {
    // 如果oldSong的索引在目前播放歌曲的索引小，那么删除它，同时当前index要减一
    if(currentIndex > fpIndex) {
      playList.splice(fpIndex, 1);
      currentIndex--;
    } else {
      // 否则直接删掉oldSong
      playList.splice(fpIndex+1, 1);
    }
  }
  // 同理，处理sequenceList
  let sequenceIndex = findIndex(playList[currentIndex], sequenceList) + 1;
  let fsIndex = findIndex(song, sequenceList);
  // 插入歌曲
  sequenceList.splice(sequenceIndex, 0, song);
  if(fsIndex > -1) {
    //跟上面类似的逻辑。如果在前面就删掉，index--;如果在后面就直接删除
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
  currentIndex: -1,//当前歌曲在播放列表的索引位置
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
    case actionTypes.INSERT_SONG:
      return handleInsertSong(state, action.data);
    default:
      return state;
  }
}