import * as actionTypes from './constants';
import { AnyAction } from 'redux';
import { produce } from 'immer';

interface IBannerListItem {
  imageUrl: string;
}

interface IRecommendListItem {
  id: string;
  picUrl: string;
  name: string;
  playCount: number;
}

export type IBannerList = IBannerListItem[];

export type IRecommendList = IRecommendListItem[];

export interface RecommendState {
  bannerList: IBannerList;
  recommendList: IRecommendList;
  enterLoading: boolean;
}

const defaultState: RecommendState = {
  bannerList: [],
  recommendList: [],
  enterLoading: true
};

export const recommendReducer = produce((state, action: AnyAction) => {
  switch(action.type) {
    case actionTypes.CHANGE_BANNER:
      state.bannerList = action.data;
      break;
    case actionTypes.CHANGE_RECOMMEND_LIST:
      state.recommendList = action.data;
      break;
    case actionTypes.CHANGE_ENTER_LOADING:
      state.enterLoading = action.data;
      break;
  }
}, defaultState);