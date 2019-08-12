import React, {  useEffect, useRef } from 'react';
import Horizen from '../../baseUI/horizen-item/index';
import { categoryTypes, alphaTypes } from '../../api/config';
import { 
  NavContainer,
  ListContainer,
  List,
  ListItem,
  EnterLoading
} from "./style";
import { connect } from 'react-redux';
import { getSingerList, changeCategory, changeAlpha, getHotSingerList, changeEnterLoading, changePageCount, refreshMoreSingerList, changePullUpLoading,changePullDownLoading, refreshMoreHotSingerList } from './store/actionCreators';
import Scroll from "../../baseUI/scroll/index";
import  LazyLoad, {forceCheck} from 'react-lazyload';
import Loading from '../../baseUI/loading/index';
import { renderRoutes } from 'react-router-config';


function Singers(props){

  const { pageCount, alpha, category, enterLoading, pullUpLoading, pullDownLoading, singerList, songsCount } = props;

  const { getHotSinger, updateCategory, updateAlpha, pullUpRefresh, pullDownRefresh } = props;

  Singers.scrollChild = useRef(null);

  // eslint-disable-next-line
  useEffect(() => {
    if(!singerList.length){
      getHotSinger();
    }
    // eslint-disable-next-line
  }, []);

  const enterDetail = (id) => {
    props.history.push(`/singers/${id}`)
  }
  const renderSingerList = () => {
    return (
      <List>
        {
          singerList.map((item, index) => {
            return (
              <ListItem key={item.accountId+""+index} onClick={() => enterDetail(item.id)}>
                <div className="img_wrapper">
                  <LazyLoad placeholder={<img width="100%" height="100%" src={require('./singer.png')} alt="music"/>}>
                    <img src={item.picUrl} width="100%" height="100%" alt="music"/>
                  </LazyLoad>
                </div>
                <span className="name">{item.name}</span>
              </ListItem>
            )
          })
        }
      </List>
    )
  }
  return (
    // 对于better-scroll来讲，其作用的元素外面必须要有一个尺寸确定的容器包裹，因此设置xxxContainer
    <div>
      <NavContainer>
        <Horizen title={"分类(默认热门):"} list={ categoryTypes } handleClick={() => updateCategory} oldVal={category}></Horizen>
        <Horizen title={"首字母:"} list={ alphaTypes } handleClick={() => updateAlpha} oldVal={alpha}></Horizen>
      </NavContainer>
      <ListContainer play={songsCount}>
        <Scroll 
          onScroll = {() => forceCheck() } 
          pullUp={() => pullUpRefresh(category, pageCount)}
          pullDown = {() => pullDownRefresh(category, alpha)}
          ref={Singers.scrollChild}
          pullUpLoading = { pullUpLoading }
          pullDownLoading = { pullDownLoading }
          data={singerList}
          >
          { renderSingerList() }
        </Scroll>
      </ListContainer>
      {/* 入场加载动画 */}
      { enterLoading ? <EnterLoading><Loading></Loading></EnterLoading> : null}
      { renderRoutes(props.route.routes) }
    </div>
  )
}
const mapStateToProps = (state) => ({
  alpha: state.getIn(['singers', 'alpha']),
  category: state.getIn(['singers', 'category']),
  singerList: state.getIn(['singers', 'singerList']).toJS(),
  enterLoading: state.getIn(['singers', 'enterLoading']),
  pullUpLoading: state.getIn(['singers', 'pullUpLoading']),
  pullDownLoading: state.getIn(['singers', 'pullDownLoading']),
  pageCount: state.getIn(['singers', 'pageCount']),
  songsCount: state.getIn(['player', 'playList']).size
});
const mapDispatchToProps = (dispatch) => {
  return {
    getHotSinger() {
      dispatch(getHotSingerList());
    },
    updateCategory(oldVal, newVal) {
      if(oldVal === newVal) return;
      Singers.scrollChild.current.refresh();
      dispatch(changeCategory(newVal));
      dispatch(changePageCount(0));
      dispatch(changeEnterLoading(true));
      dispatch(getSingerList());
    },
    updateAlpha(oldVal, newVal) {
      if(oldVal === newVal) return;
      Singers.scrollChild.current.refresh();
      dispatch(changeAlpha(newVal));
      dispatch(changePageCount(0));
      dispatch(changeEnterLoading(true));
      dispatch(getSingerList());
    },
    //滑到最底部刷新部分的处理
    pullUpRefresh(category, pageCount) {
      dispatch(changePullUpLoading(true));
      dispatch(changePageCount(pageCount + 1));
      console.log("category", category)
      if(category === ''){
        dispatch(refreshMoreHotSingerList());
      } else {
        dispatch(refreshMoreSingerList());
      }
    },
    //顶部下拉刷新
    pullDownRefresh(category, alpha) {
      dispatch(changePullDownLoading(true));
      dispatch(changePageCount(0));
      if(category === '' && alpha === ''){
        dispatch(getHotSingerList());
      } else {
        dispatch(getSingerList());
      }
    }
  }
};   

export default connect(mapStateToProps, mapDispatchToProps)(Singers);