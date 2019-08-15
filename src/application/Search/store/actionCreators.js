
import { SET_HOT_KEYWRODS, SET_SUGGEST_LIST, SET_RESULT_SONGS_LIST, SET_ENTER_LOADING } from './constants';
import { fromJS } from 'immutable';
import { getHotKeyWordsRequest, getSuggestListRequest, getResultSongsListRequest } from './../../../api/request';

const changeHotKeyWords = (data) => ({
  type: SET_HOT_KEYWRODS,
  data: fromJS(data)
});

const changeSuggestList = (data) => ({
  type: SET_SUGGEST_LIST,
  data: fromJS(data)
});

const changeResultSongs = (data) => ({
  type: SET_RESULT_SONGS_LIST,
  data: fromJS(data)
});

export const changeEnterLoading = (data) => ({
  type: SET_ENTER_LOADING,
  data
});

export const getHotKeyWords = () => {
  return dispatch => {
    getHotKeyWordsRequest().then(data => {
      let list = data.result.hots;
      dispatch(changeHotKeyWords(list));
    })
  }
};
export const getSuggestList = (query) => {
  return dispatch => {
    getSuggestListRequest(query).then(data => {
      if(!data)return;
      let res = data.result || [];
      dispatch(changeSuggestList(res));
    })
    getResultSongsListRequest(query).then(data => {
      if(!data)return;
      let res = data.result.songs || [];
      dispatch(changeResultSongs(res));
      dispatch(changeEnterLoading(false));
    })
  }
};
