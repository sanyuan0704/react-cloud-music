import { CHANGE_CURRENT_ALBUM, CHANGE_TOTAL_COUNT, CHANGE_PULLUP_LOADING, CHANGE_START_INDEX, CHANGE_ENTER_LOADING, CHANGE_SCROLL_Y } from './constants';
import { getRecommendListDetailRequest, getRankListDetailRequest } from '../../../api/request';
import { fromJS } from 'immutable';

const changeCurrentAlbum = (data) => ({
  type: CHANGE_CURRENT_ALBUM,
  data: fromJS(data)
});

export const changePullUpLoading = (data) => ({
  type: CHANGE_PULLUP_LOADING,
  data
});
export const changeEnterLoading = (data) => ({
  type: CHANGE_ENTER_LOADING,
  data
});

const changeTotalCount = (data) => ({
  type: CHANGE_TOTAL_COUNT,
  data
});

export const changeStartIndex = (data) => ({
  type: CHANGE_START_INDEX,
  data
});

export const changeScrollY = (data) => ({
  type: CHANGE_SCROLL_Y,
  data
});


export const getAlbumList = (id, fromURL) => {
  let request;
  switch (fromURL) {
    case "/recommend":
      request = getRecommendListDetailRequest;
      break;
    case "/rank":
      request = getRankListDetailRequest;
      break;
    default:
      request = getRecommendListDetailRequest;
  }
  return dispatch => {
    request(id).then(res => {
      let data = res.playlist;
      dispatch(changeCurrentAlbum(data));
      dispatch(changeEnterLoading(false));
      dispatch(changeStartIndex(0));
      dispatch(changeTotalCount(data.tracks.length))
    }).catch(() => {
      console.log("获取album数据失败!")
    })
  }
};
