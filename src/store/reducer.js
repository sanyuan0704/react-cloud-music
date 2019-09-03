import { combineReducers } from 'redux-immutable';
import { reducer as recommendReducer } from '../application/Recommend/store/index';
import { reducer as singersReducer } from '../application/Singers/store/index';

export default combineReducers({
  // 之后开发具体功能模块的时候添加reducer
  recommend: recommendReducer,
  singers: singersReducer ,
});