import * as actionTypes from './constants';
import { fromJS } from 'immutable';

const defaultState = fromJS({
  category: "",
  alpha: "",
  singerList: [],
  enterLoading: true,
  pullUpLoading: false,
  pullDownLoading: false,
  listOffset: 0, // 请求列表的偏移不是page，是个数
})

export default (state = defaultState, action) => {
  switch(action.type) {
    case actionTypes.CHANGE_ALPHA:
      return state.merge({
        'alpha': action.data,
        listOffset: 0,
        enterLoading: true
      });
    case actionTypes.CHANGE_CATOGORY:
      return state.merge({
        'category': action.data,
        listOffset: 0,
        enterLoading: true
      });;
    case actionTypes.CHANGE_SINGER_LIST:
      return state.set('singerList', action.data);
    case actionTypes.CHANGE_LIST_OFFSET:
      return state.set('listOffset', action.data);
    case actionTypes.CHANGE_ENTER_LOADING:
      return state.set('enterLoading', action.data);
    case actionTypes.CHANGE_PULLUP_LOADING:
      return state.set('pullUpLoading', action.data);
    case actionTypes.CHANGE_PULLDOWN_LOADING:
      return state.set('pullDownLoading', action.data);
    default:
      return state;
  }
}