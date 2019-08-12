import React, { PureComponent } from 'react';
import { Container } from './../Album/style';
import Header from '../../baseUI/header/index'
import { ImgWrapper, CollectButton, SongListWrapper, BgLayer } from "./style";
import Scroll from '../../baseUI/scroll/index';
import { HEADER_HEIGHT } from './../../api/config';
import { getSingerInfo } from './store/actionCreators';
import { connect } from 'react-redux';
import Loading from './../../baseUI/loading/index';
import { EnterLoading } from '../Singers/style';
import {changeEnterLoading} from './store/actionCreators';
import { CSSTransition } from 'react-transition-group';
import SongsList from '../SongList/';
import MusicNote from '../../baseUI/music-note/index';

// 歌手列表组件bug修复后一起重构成函数组件
class Singer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showStatus: true
    }
    this.collectButton = React.createRef();
    this.imageWrapper = React.createRef();
    this.songScroll = React.createRef();
    this.Scroll = React.createRef();
    this.header = React.createRef();
    this.layer = React.createRef();
    this.musicNoteRef = React.createRef();
  } 

  componentDidMount() {
    const id = this.props.match.params.id; 
    this.props.getSingerDataDispatch(id);
    this.height = this.imageWrapper.current.offsetHeight;
    this.songScroll.current.style.top = `${this.height-5}px`;
    this.layer.current.style.top = `${this.height-5}px`;
    this.Scroll.current.refresh();
  }
  handleScroll(pos) {
    const OFFSET = 5;//歌曲列表向上偏移5px
    const newY = pos.y;
    const imageDOM = this.imageWrapper.current;
    const buttonDOM = this.collectButton.current;
    const headerDOM = this.header.current;
    const layerDOM = this.layer.current;
    const minScrollY = -(this.height-OFFSET) + HEADER_HEIGHT;

    const percent = Math.abs(newY / this.height);
    //说明: 在歌手页的布局中，歌单列表其实是没有自己的背景的，layerDOM其实是起一个遮罩的作用，给歌单内容提供白色背景
    //因此在处理的过程中，随着内容的滚动，遮罩也跟着移动
    if(newY > 0) {
      //处理往下拉的情况,效果：图片放大，按钮跟着偏移
      imageDOM.style["transform"] = `scale(${1+percent})`;
      buttonDOM.style["transform"] = `translate3d(0, ${newY}px, 0)`;
      layerDOM.style.top = `${this.height-OFFSET+newY}px`;
    } else if(newY >= minScrollY){
      //往上滑动，但是还没超过Header部分
      layerDOM.style.top = `${this.height-OFFSET-Math.abs(newY)}px`;
      layerDOM.style.zIndex = 1;
      imageDOM.style.paddingTop = '75%';
      imageDOM.style.height = 0;
      imageDOM.style.zIndex = -1;
      buttonDOM.style["transform"] = `translate3d(0, ${newY}px, 0)`;
      buttonDOM.style["opacity"] = `${1-percent*2}`;
    } else if(newY < minScrollY){
      //往上滑动，但是超过Header部分
      layerDOM.style.top = `${HEADER_HEIGHT-OFFSET}px`;
      layerDOM.style.zIndex = 1;
      //防止溢出的歌单内容遮住Header
      headerDOM.style.zIndex = 100;
      //此时图片高度与Header一致
      imageDOM.style.height = `${HEADER_HEIGHT}px`
      imageDOM.style.paddingTop = 0;
      imageDOM.style.zIndex = 99;
    }
  }
  handleBack() {
    this.setState({
      showStatus: false
    } , () => {
      setTimeout(() => {
        this.props.history.push('/singers');
      }, 300)
    })
  };
  musicAnimation(x, y) {
    this.musicNoteRef.current.startAnimation({x, y});
  }
  render() {
    const { artist, songs, loading } = this.props;
    
    return (
      <CSSTransition 
        in={this.state.showStatus}  
        timeout={300} 
        classNames="fly" 
        appear={true}
        onExited={() => this.props.history.goBack()}
      >
        <Container>
          <Header handleClick={() => this.handleBack()} title={artist.name} ref={this.header}></Header>
          <ImgWrapper ref={this.imageWrapper} bgUrl={artist.picUrl}>
            <div className="filter"></div>
          </ImgWrapper>
          <CollectButton ref={this.collectButton}>
              <i className="iconfont">&#xe62d;</i>
              <span className="text">收藏</span>
          </CollectButton>
          <BgLayer ref={this.layer}></BgLayer>
          <SongListWrapper ref={this.songScroll} play={this.props.songsCount}>
            <Scroll onScroll={(pos) => this.handleScroll(pos)} ref={this.Scroll}>
              <SongsList
                songs={songs}
                showCollect={false}
                usePageSplit={false}
                musicAnimation={(x,y) =>this.musicAnimation(x,y)}
              >
              </SongsList>
            </Scroll>
          </SongListWrapper>
          {loading ? <EnterLoading style={{"zIndex": 100}}><Loading></Loading></EnterLoading> : null}
          <MusicNote ref={this.musicNoteRef} ></MusicNote>
        </Container>
      </CSSTransition>
    )
  }
}

// 映射Redux全局的state到组件的props上
const mapStateToProps = (state) => ({
  artist: state.getIn(['singerInfo', 'artist']).toJS(),
  songs: state.getIn(['singerInfo', 'songsOfArtist']).toJS(),
  loading: state.getIn(['singerInfo', 'loading']),
  songsCount: state.getIn(['player', 'playList']).size
});
// 映射dispatch到props上
const mapDispatchToProps = (dispatch) => {
  return {
    getSingerDataDispatch(id) {
      dispatch(changeEnterLoading(true));
      dispatch(getSingerInfo(id));
    }
  }
};

// 将ui组件包装成容器组件
export default connect(mapStateToProps, mapDispatchToProps)(Singer);
