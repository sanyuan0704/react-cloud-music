# react hooks+redux+immutable.js仿网易云音乐打造精美webApp

[在线体验地址](http://47.98.159.95:8010)

从开发到拆解教程，前端万粉博主——神三元([掘金](https://juejin.im/user/5c45ddf06fb9a04a006f5491)|[知乎](https://www.zhihu.com/people/yang-xing-yuan-9/activities))全程亲自操刀，项目代码质量、可维护性均有保证。

系列拆解文章已经出炉，整理成了掘金小册，请点[这里](https://juejin.im/book/5da96626e51d4524ba0fd237)查看。如遇到问题，或者需要联系加群，请加微信: `FESanyuan`。

移动端和PC端的chrome浏览器食用更佳 : )

打开方式:
1. 将项目 clone 下来
```shell
$ git clone https://github.com/sanyuan0704/cloud-music.git
$ cd cloud-music
$ npm install

// 下载子模块
$ git submodule update --init --recursive
$ cd NeteaseCloudMusicApi
$ npm install 
$ cd ../  (注意: 一定要返回到上一层)
```
接下来，要记得把`src/api/config.js`中把`baseUrl`改成接口的地址。（一定要记得,不然报404!）

2. 运行
```shell
$ npm run start
```

现在就在本地的3000端口访问了。如果要打包到线上，执行`npm run build`即可。


项目介绍:

说明:本项目参考网易云音乐安卓端app界面开发，基础UI绝大多数自己来构建，算是对自己的一个挑战，在这个过程也学到了不少设计经验。

![](https://user-gold-cdn.xitu.io/2019/8/11/16c80048984d1af3?w=1423&h=1092&f=png&s=407282)

### 功能介绍

#### 1、推荐部分

首页推荐:

![](https://user-gold-cdn.xitu.io/2019/8/11/16c7f735b83a0d15?w=372&h=668&f=gif&s=2856467)

推荐歌单详情:

![](https://user-gold-cdn.xitu.io/2019/8/11/16c7f75ca0469552?w=372&h=668&f=gif&s=1862466)

空中切入切出效果，另外还有随着滑动会产生和标题跑马灯效果。
在歌单中歌曲数量过多的情况下，做了分页处理，随着滚动不断进行上拉加载，防止大量DOM加载导致的页面卡顿。

#### 2、歌手部分
歌手列表:

![](https://user-gold-cdn.xitu.io/2019/8/11/16c7f793e8a1524b?w=372&h=668&f=gif&s=1224668)

这里做了异步加载的处理，上拉到底进行新数据的获取，下拉则进行数据的重新加载。

歌手详情:

![](https://user-gold-cdn.xitu.io/2019/8/11/16c7f7ea74fffa11?w=372&h=668&f=gif&s=2435912)


#### 3、排行榜

榜单页:

![](https://user-gold-cdn.xitu.io/2019/8/11/16c7f811ec0f7375?w=372&h=668&f=gif&s=2334445)

榜单详情:

![](https://user-gold-cdn.xitu.io/2019/8/11/16c7f82639a1dc34?w=372&h=668&f=gif&s=2162917)

#### 4、播放器

播放器内核:

![](https://user-gold-cdn.xitu.io/2019/8/11/16c7f8a5687ebb93?w=372&h=668&f=gif&s=3339773)

播放列表:

![](https://user-gold-cdn.xitu.io/2019/8/11/16c7f98711c43ae3?w=372&h=667&f=gif&s=2223620)

会有移动端app一样的反弹效果。

#### 5、搜索部分

![](https://user-gold-cdn.xitu.io/2019/8/11/16c804bd87a2dbbe?w=372&h=667&f=gif&s=1275414)


### 项目部分模块分享

#### 1、利用better-scroll打造超级好用的scroll基础组件

```js
import React, { forwardRef, useState,useEffect, useRef, useImperativeHandle } from "react"
import PropTypes from "prop-types"
import BScroll from "better-scroll"
import styled from 'styled-components';
import { debounce } from "../../api/utils";

const ScrollContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
`

const Scroll = forwardRef((props, ref) => {
  const [bScroll, setBScroll] = useState();

  const scrollContaninerRef = useRef();

  const { direction, click, refresh, pullUpLoading, pullDownLoading, bounceTop, bounceBottom } = props;

  const { pullUp, pullDown, onScroll } = props;

  useEffect(() => {
    if(bScroll) return;
    const scroll = new BScroll(scrollContaninerRef.current, {
      scrollX: direction === "horizental",
      scrollY: direction === "vertical",
      probeType: 3,
      click: click,
      bounce:{
        top: bounceTop,
        bottom: bounceBottom
      }
    });
    setBScroll(scroll);
    if(pullUp) {
      scroll.on('scrollEnd', () => {
        //判断是否滑动到了底部
        if(scroll.y <= scroll.maxScrollY + 100){
          pullUp();
        }
      });
    }
    if(pullDown) {
      scroll.on('touchEnd', (pos) => {
        //判断用户的下拉动作
        if(pos.y > 50) {
          debounce(pullDown, 0)();
        }
      });
    }

    if(onScroll) {
      scroll.on('scroll', (scroll) => {
        onScroll(scroll);
      })
    }

    if(refresh) {
      scroll.refresh();
    }
    return () => {
      scroll.off('scroll');
      setBScroll(null);
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if(refresh && bScroll){
      bScroll.refresh();
    }
  })

  useImperativeHandle(ref, () => ({
    refresh() {
      if(bScroll) {
        bScroll.refresh();
        bScroll.scrollTo(0, 0);
      }
    }
  }));

  const PullUpdisplayStyle = pullUpLoading ? { display: "" } : { display: "none" };
  const PullDowndisplayStyle = pullDownLoading ? { display: "" } : { display: "none" };
  return (
    <ScrollContainer ref={scrollContaninerRef}>
      {props.children}
      {/* 滑到底部加载动画 */}
      <PullUpLoading style={ PullUpdisplayStyle }></PullUpLoading>
      {/* 顶部下拉刷新动画 */}
      <PullDownLoading style={ PullDowndisplayStyle }></PullDownLoading>
    </ScrollContainer>
  );
})

Scroll.defaultProps = {
  direction: "vertical",
  click: true,
  refresh: true,
  onScroll: null,
  pullUpLoading: false,
  pullDownLoading: false,
  pullUp: () => {},
  pullDown: () => {},
  bounceTop: true,
  bounceBottom: true
};

Scroll.propTypes = {
  direction: PropTypes.oneOf(['vertical', 'horizental']),
  refresh: PropTypes.bool,
  onScroll: PropTypes.func,
  pullUp: PropTypes.func,
  pullDown: PropTypes.func,
  pullUpLoading: PropTypes.bool,
  pullDownLoading: PropTypes.bool,
  bounceTop: PropTypes.bool,//是否支持向上吸顶
  bounceBottom: PropTypes.bool//是否支持向上吸顶
};

export default React.memo(Scroll);
```
#### 2、富有动感的loading组件

```js
import React from 'react';
import styled, {keyframes} from 'styled-components';
import style from '../../assets/global-style'

const dance = keyframes`
    0%, 40%, 100%{
      transform: scaleY(0.4);
      transform-origin: center 100%;
    }
    20%{
      transform: scaleY(1);
    }
`
const Loading = styled.div`
    height: 10px;
    width: 100%;
    margin: auto;
    text-align: center;
    font-size: 10px;
    >div{
      display: inline-block;
      background-color: ${style["theme-color"]};
      height: 100%;
      width: 1px;
      margin-right:2px;
      animation: ${dance} 1s infinite;
    }
    >div:nth-child(2) {
      animation-delay: -0.4s;
    }
    >div:nth-child(3) {
      animation-delay: -0.6s;
    }
    >div:nth-child(4) {
      animation-delay: -0.5s;
    }
    >div:nth-child(5) {
      animation-delay: -0.2s;
    } 
`

function LoadingV2() {
  return (
    <Loading>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <span>拼命加载中...</span>
    </Loading>
  );
}
 
export default LoadingV2;
```

![](https://user-gold-cdn.xitu.io/2019/8/11/16c801f8bc254d65?w=250&h=35&f=gif&s=20097)

#### 3、模块懒加载及代码分割(CodeSpliting)
react官方已经提供了相应的方案, 用react自带的lazy和Suspense即可完成。
操作如下:
```js
import React, {lazy, Suspense} from 'react';
const HomeComponent = lazy(() => import("../application/Home/"));
const Home = (props) => {
  return (
    <Suspense fallback={null}>
      <HomeComponent {...props}></HomeComponent>
    </Suspense>
  )
};
......
export default [
  {
    path: "/",
    component: Home,
    routes: [
      {
        path: "/",
        exact: true,
        render:  ()=> (
          <Redirect to={"/recommend"}/>
        )
      },
      {
        path: "/recommend/",
        extra: true,
        key: 'home',
        component: Recommend,
        routes:[{
          path: '/recommend/:id',
          component: Album,
        }]
      }
      ......
    ]
  },

];
```

### 未来规划和展望
目前这个项目的核心已经完成，但是还是有很多扩展的余地。关于未来的规划，我是这么安排的:

- 完成收藏、播放历史功能
- 完成登录功能和评论模块
- 实现MV模块
- 同时撰写《手摸手，一起用React实现网易云音乐webApp》系列拆解文章
- 未来更多功能待补充...

这个项目长期维护，希望大家踊跃提issue和pr，把这个项目打造得更加完美，帮助到更多的react开发者！

