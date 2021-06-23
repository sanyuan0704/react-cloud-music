import React, { useEffect } from 'react';
import Slider from '../../components/slider';
import { useSelector, useDispatch } from "react-redux";
import * as actionTypes from './store/actionCreators';
import RecommendList from '../../components/list';
import { Scroll } from '../../baseUI/scroll/index';
import { Content } from './style';
import { forceCheck } from 'react-lazyload';
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config';
import { RootState } from '../../store/reducer';
// import { EnterLoading } from './../Singers/style';
// import Loading from '../../baseUI/loading-v2/index';

const Recommend = (props: RouteConfigComponentProps) => {
  const { bannerList, recommendList, songsCount, enterLoading } = useSelector((state: RootState) => ({
    bannerList: state.recommend.bannerList,
    recommendList: state.recommend.recommendList,
    songsCount: 0,
    enterLoading: state.recommend.enterLoading
  }));

  const dispatch = useDispatch();

  const getBannerDataDispatch = () => {
    dispatch(actionTypes.getBannerList());
  };

  const getRecommendListDataDispatch = () => {
    dispatch(actionTypes.getRecommendList());
  }

  useEffect(() => {
    if(!bannerList.length){
      getBannerDataDispatch();
    }
    if(!recommendList.length){
      getRecommendListDataDispatch();
    }
    // eslint-disable-next-line
  }, []);


  return (
    <Content play={songsCount}>
      <Scroll className="list" onScroll={forceCheck}>
        <div>
          <Slider bannerList={bannerList}></Slider>
          <RecommendList recommendList={recommendList}></RecommendList>
        </div>
      </Scroll>
      {enterLoading? "loading..." : null}
      { renderRoutes(props.route?.routes) }
    </Content> 
  );
};

export default React.memo(Recommend);