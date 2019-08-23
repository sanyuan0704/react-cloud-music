import React, { PureComponent } from 'react';
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

// 这里采用class，之前写过hooks版，但是pageCount的更新存在bug,
// 有兴趣的小伙伴可以试试改为hooks版本， bug修复后换成函数式，欢迎大家提pr修正
class Singers extends PureComponent{
  constructor(props) {
    super(props);
    Singers.scrollChild = React.createRef(null);
  }
  componentDidMount() {
    if(!this.props.singerList.length && !this.props.category && !this.props.alpha){
      this.props.getHotSinger();
    }
  }

  enterDetail (id) {
    this.props.history.push(`/singers/${id}`);
  }
  handlePullUp () {
    this.props.pullUpRefresh(this.props.category === '', this.props.pageCount);
  }
  handlePullDown(){
    this.props.pullDownRefresh(this.props.category, this.props.pageCount);
  }
  handleUpdateCategory(newVal) {
    if(this.props.category === this.props.newVal) return;
    this.props.updateCategory(newVal);
  }

  handleUpdateAlpha(newVal) {
    if(this.props.alpha === newVal) return;
    this.props.updateAlpha(newVal);
  }
  renderSingerList()  {
    const {singerList} = this.props;

    return (
      <List>
        {
          singerList.toJS().map((item, index) => {
            return (
              <ListItem key={item.accountId+""+index} onClick={() => this.enterDetail(item.id)}>
                <div className="img_wrapper">
                  <LazyLoad placeholder={<img width="100%" height="100%" src={require('./singer.png')} alt="music"/>}>
                    <img src={`${item.picUrl}?param=300x300`} width="100%" height="100%" alt="music"/>
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
  render() {
    const { alpha, category, enterLoading, songsCount, pullUpLoading,pullDownLoading  } = this.props;

    return (
      <div>
        {/* 对于better-scroll来讲，其作用的元素外面必须要有一个尺寸确定的容器包裹，因此设置xxxContainer */}
        <NavContainer>
          <Horizen title={"分类(默认热门):"} list={ categoryTypes } handleClick={(v) => this.handleUpdateCategory(v)} oldVal={category}></Horizen>
          <Horizen title={"首字母:"} list={ alphaTypes } handleClick={(v) => this.handleUpdateAlpha(v)} oldVal={alpha}></Horizen>
        </NavContainer>
        <ListContainer play={songsCount}>
          <Scroll 
            onScroll = {() => forceCheck() } 
            pullUp={() => this.handlePullUp()}
            pullDown = {() => this.handlePullDown()}
            ref={Singers.scrollChild}
            pullUpLoading = { pullUpLoading }
            pullDownLoading = { pullDownLoading }
            >
            { this.renderSingerList() }
          </Scroll>
        </ListContainer>
        {/* 入场加载动画 */}
        { enterLoading ? <EnterLoading><Loading></Loading></EnterLoading> : null}
        { renderRoutes(this.props.route.routes) }
      </div>
    )
  }
}
const mapStateToProps = (state) => ({
  alpha: state.getIn(['singers', 'alpha']),
  category: state.getIn(['singers', 'category']),
  singerList: state.getIn(['singers', 'singerList']),
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
    updateCategory(newVal) {
      Singers.scrollChild.current.refresh();
      dispatch(changeCategory(newVal));
      dispatch(changePageCount(0));
      dispatch(changeEnterLoading(true));
      dispatch(getSingerList());
    },
    updateAlpha(newVal) {
      Singers.scrollChild.current.refresh();
      dispatch(changeAlpha(newVal));
      dispatch(changePageCount(0));
      dispatch(changeEnterLoading(true));
      dispatch(getSingerList());
    },
    // 滑到最底部刷新部分的处理
    pullUpRefresh(hot, count) {
      dispatch(changePullUpLoading(true));
      dispatch(changePageCount(count+1));
      if(hot){
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