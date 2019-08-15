import React from 'react';
import {
  ListWrapper,
  ListItem,
  List
} from './style';
import LazyLoad from "react-lazyload";
import { withRouter } from 'react-router-dom';

function RecommendList(props) {
  const enterDetail = (id) => {
    props.history.push(`/recommend/${id}`)
  }
  return (
    <ListWrapper>
      <List>
        {
          props.recommendList.map(item => {
            return (
              <ListItem key={item.id} onClick={() => enterDetail(item.id)}>
                <div className="img_wrapper">
                  <div className="decorate"></div>
                  <LazyLoad placeholder={<img width="100%" height="100%" src={require('./music.png')} alt="music"/>}>
                    <img src={item.picUrl} width="100%" height="100%" alt="music"/>
                  </LazyLoad>
                  <div className="play_count">
                    <i className="iconfont play">&#xe885;</i>
                    <span className="count">{Math.floor(item.playCount/10000)}万</span>
                  </div>
                </div>
                <div className="desc">{item.name}</div>
              </ListItem>
            )
          })
        }
      </List>
    </ListWrapper>
  );
  }

export default withRouter(React.memo(RecommendList));