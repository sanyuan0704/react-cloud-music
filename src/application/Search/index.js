import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import SearchBox from './../../baseUI/search-box/index';
import { getHotKeyWords, changeEnterLoading, getSuggestList } from './store/actionCreators';
import { connect } from 'react-redux';
import { getSongDetail } from './../Player/store/actionCreators';
import { Container, ShortcutWrapper, HotKey } from './style';
import Scroll from '../../baseUI/scroll';
import Loading from './../../baseUI/loading/index';
import LazyLoad, {forceCheck} from 'react-lazyload';
import { List, ListItem, SongItem } from './style';
import { getName } from '../../api/utils';
import MusicalNote from '../../baseUI/music-note';

function Search(props) {
  const [show, setShow] = useState(false);
  const [query, setQuery] = useState('');
  const musicNoteRef = useRef();

  const {
    hotList, 
    enterLoading, 
    suggestList: immutableSuggestList, 
    songsCount, 
    songsList: immutableSongsList
  } = props;
  
  const suggestList = immutableSuggestList.toJS();
  const songsList = immutableSongsList.toJS();
  const {
    getHotKeyWordsDispatch,
    changeEnterLoadingDispatch,
    getSuggestListDispatch,
    getSongDetailDispatch
  } = props;

  useEffect(() => {
    setShow(true);
    //用了redux缓存，不再赘述
    console.log(hotList)
    if(!hotList.size)
      getHotKeyWordsDispatch();
    // eslint-disable-next-line
  }, []);

  const searchBack = useCallback(() => {
    setShow(false);
  }, []);

  const handleQuery = (q) => {
    setQuery(q);
    if(!q) return;
    changeEnterLoadingDispatch(true);
    getSuggestListDispatch(q);
  };

  const renderHotKey = () => {
    let list = hotList ? hotList.toJS(): [];
    return (
      <ul>
        {
          list.map(item => {
            return (
              <li className="item" key={item.first} onClick={() => setQuery(item.first)}>
                <span>{item.first}</span>
              </li>
            )
          })
        }
      </ul>
    )
  };

  const renderAlbum = () => {
    let albums = suggestList.playlists;
    if(!albums || !albums.length) return;
    return (
      <List>
        <h1 className="title">相关歌单</h1>
        {
          albums.map((item, index) => {
            return (
              <ListItem key={item.accountId+""+index} onClick={() => props.history.push(`/album/${item.id}`)}>
                <div className="img_wrapper">
                  <LazyLoad placeholder={<img width="100%" height="100%" src={require('./music.png')} alt="music"/>}>
                    <img src={item.coverImgUrl} width="100%" height="100%" alt="music"/>
                  </LazyLoad>
                </div>
                <span className="name">歌单: {item.name}</span>
              </ListItem>
            )
          })
        }
      </List>
    )
  };
  const renderSingers = () => {
    let singers = suggestList.artists;
    if(!singers || !singers.length) return;
    return (
      <List>
        <h1 className="title">相关歌手</h1>
        {
          singers.map((item, index) => {
            return (
              <ListItem key={item.accountId+""+index} onClick={() => props.history.push(`/singers/${item.id}`)}>
                <div className="img_wrapper">
                  <LazyLoad placeholder={<img width="100%" height="100%" src={require('./singer.png')} alt="singer"/>}>
                    <img src={item.picUrl} width="100%" height="100%" alt="music"/>
                  </LazyLoad>
                </div>
                <span className="name">歌手: {item.name}</span>
              </ListItem>
            )
          })
        }
      </List>
    )
  };

  const renderSongs = () => {
    return (
      <SongItem style={{paddingLeft: "20px"}} > 
        {
          songsList.map(item => {
            return (
              <li key={item.id} onClick={(e) => selectItem(e, item.id)}>
                <div className="info">
                  <span>{item.name}</span>
                  <span>
                    { getName(item.artists) } - { item.album.name }
                  </span>
                </div>
              </li>
            )
          })
        }
      </SongItem>
    )
  };

  const selectItem = (e, id) => {
    getSongDetailDispatch(id);
    console.log(e);
    musicNoteRef.current.startAnimation({x:e.nativeEvent.clientX, y:e.nativeEvent.clientY});
  }
  return (
    <CSSTransition
      in={show}
      timeout={300}
      appear={true}
      classNames="fly"
      unmountOnExit
      onExited={() => props.history.goBack()}
    >
    <Container play={songsCount}>
      <div className="search_box_wrapper">
        <SearchBox back={searchBack} newQuery={query} handleQuery={handleQuery}></SearchBox>
      </div>
      <ShortcutWrapper show={!query}>
        <Scroll>
          <div>
            <HotKey>
              <h1 className="title">热门搜索</h1>
              {renderHotKey()}
            </HotKey>
          </div>
        </Scroll>
      </ShortcutWrapper>
      <ShortcutWrapper show={query}>
        <Scroll onScorll={forceCheck}>
          <div>
            { renderSingers() }
            { renderAlbum() }
            { renderSongs() }
          </div>
        </Scroll>
      </ShortcutWrapper>
      { enterLoading? <Loading></Loading> : null }
      <MusicalNote ref={musicNoteRef}></MusicalNote>
    </Container>
  </CSSTransition>
  )
}

// 映射Redux全局的state到组件的props上
const mapStateToProps = (state) => ({
  hotList: state.getIn(['search', 'hotList']),
  enterLoading: state.getIn(['search', 'enterLoading']),
  suggestList: state.getIn(['search', 'suggestList']),
  songsCount: state.getIn(['player', 'playList']).size,
  songsList: state.getIn(['search', 'songsList'])
});

// 映射dispatch到props上
const mapDispatchToProps = (dispatch) => {
  return {
    getHotKeyWordsDispatch() {
      dispatch(getHotKeyWords());
    },
    changeEnterLoadingDispatch(data) {
      dispatch(changeEnterLoading(data))
    },
    getSuggestListDispatch(data) {
      dispatch(getSuggestList(data));
    },
    getSongDetailDispatch(id) {
      dispatch(getSongDetail(id));
    }
  }
};
// 将ui组件包装成容器组件
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Search));