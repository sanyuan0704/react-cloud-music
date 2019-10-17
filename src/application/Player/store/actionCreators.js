import { SET_CURRENT_SONG, SET_FULL_SCREEN, SET_PLAYING_STATE, SET_SEQUECE_PLAYLIST, SET_PLAYLIST, SET_PLAY_MODE, SET_CURRENT_INDEX, SET_SHOW_PLAYLIST, DELETE_SONG, INSERT_SONG, CHANGE_SPEED } from './constants';
import { fromJS } from 'immutable';
import { getSongDetailRequest } from '../../../api/request';

export const changeCurrentSong = (data) => ({
  type: SET_CURRENT_SONG,
  data: fromJS(data)
});

export const changeFullScreen =  (data) => ({
  type: SET_FULL_SCREEN,
  data
});

export const changePlayingState = (data) => ({
  type: SET_PLAYING_STATE,
  data
});

export const changeSequecePlayList = (data) => ({
  type: SET_SEQUECE_PLAYLIST,
  data: fromJS(data)
});

export const changePlayList  = (data) => ({
  type: SET_PLAYLIST,
  data: fromJS(data)
});

export const changePlayMode = (data) => ({
  type: SET_PLAY_MODE,
  data
});

export const changeSpeed = (data) => ({
  type: CHANGE_SPEED,
  data
});

export const changeCurrentIndex = (data) => ({
  type: SET_CURRENT_INDEX,
  data
});

export const changeShowPlayList = (data) => ({
  type: SET_SHOW_PLAYLIST,
  data
});

export const insertSong = (data) => ({
  type: INSERT_SONG,
  data
});

export const deleteSong = (data) => ({
  type: DELETE_SONG,
  data
});

// const insertSong = (dispatch, getState, song) => {
//   const playList = JSON.parse(JSON.stringify(getState().getIn(['player', 'playList']).toJS()));
//   const sequenceList = JSON.parse(JSON.stringify(getState().getIn(['player', 'sequencePlayList']).toJS()));
//   let currentIndex = getState().getIn(['player', 'currentIndex']);
//   //看看有没有同款
//   let fpIndex = findIndex(song, playList);
//   // 如果是当前歌曲直接不处理
//   if(fpIndex === currentIndex && currentIndex != -1) return;
//   currentIndex++;
//   // 把歌放进去,放到当前播放曲目的下一个位置
//   playList.splice(currentIndex, 0, song);
//   console.log(playList)
//   console.log(currentIndex)
//   console.log(fpIndex)
//   // 如果列表中已经存在要添加的歌
//   if(fpIndex > -1) {
//     if(currentIndex > fpIndex) {
//       playList.splice(fpIndex, 1);
//       currentIndex--;
//     } else {
//       playList.splice(fpIndex+1, 1);
//     }
//   }

//   let sequenceIndex = findIndex(playList[currentIndex], sequenceList) + 1;
//   sequenceList.splice(sequenceIndex, 0, song);
//   let fsIndex = findIndex(song, sequenceList);
//   if(fsIndex > -1) {
//     if(currentIndex > fsIndex) {
//       sequenceList.splice(fsIndex, 1);
//       currentIndex--;
//     } else {
//       sequenceList.splice(fsIndex + 1, 1);
//     }
//   }
//   dispatch(changePlayList(playList));
//   dispatch(changeSequecePlayList(sequenceList));
//   dispatch(changeCurrentIndex(currentIndex));
// }

export const getSongDetail = (id) => {
  return (dispatch) => {
    getSongDetailRequest(id).then(data => {
      let song = data.songs[0];
      dispatch(insertSong( song));
    })
  }
}