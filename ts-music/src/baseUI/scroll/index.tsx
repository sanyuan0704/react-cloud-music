import React, { forwardRef, useState,useEffect, useRef, useImperativeHandle, useMemo, ReactNode } from "react";
import BScroll from "better-scroll";
import styled from 'styled-components';
import Loading from '../loading/index';
import Loading2 from '../loading-v2/index';
import { debounce, noop } from 'lodash';

interface ScrollProps {
  direction?: "vertical" | "horizental";
  click?: boolean;
  refresh?: boolean;
  pullUpLoading?: boolean;
  pullDownLoading?: boolean;
  bounceTop?: boolean;
  bounceBottom?: boolean;
  onScroll: Function;
  pullUp?: () => void;
  pullDown?: () => void;
  children: ReactNode;
  className: string;
}

interface PosData {
  x: number;
  y: number;
}

const ScrollContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
`

const PullUpLoading = styled.div`
  position: absolute;
  left:0; right:0;
  bottom: 5px;
  width: 60px;
  height: 60px;
  margin: auto;
  z-index: 100;
`

export const PullDownLoading = styled.div`
  position: absolute;
  left:0; right:0;
  top: 0px;
  height: 30px;
  margin: auto;
  z-index: 100;
`

// direction: "vertical",
// click: true,
// refresh: true,
// onScroll:null,
// pullUpLoading: false,
// pullDownLoading: false,
// pullUp: null,
// pullDown: null,
// bounceTop: true,
// bounceBottom: true

export const Scroll = forwardRef((props: ScrollProps, ref) => {
  const [bScroll, setBScroll] = useState<BScroll | null>(null);

  const scrollContaninerRef = useRef<HTMLDivElement | null>(null);

  const { 
    direction = "vertical", 
    click = true, 
    refresh = true, 
    pullUpLoading = false, 
    pullDownLoading = false, 
    bounceTop = true, 
    bounceBottom = true,
  } = props;

  const { pullUp = noop, pullDown = noop, onScroll } = props;

  const pullUpDebounce = useMemo(() => {
    return debounce(pullUp, 500)
  }, [pullUp]);

  const pullDownDebounce = useMemo(() => {
    return debounce(pullDown, 500)
  }, [pullDown]);

  useEffect(() => {
    const scroll = new BScroll(scrollContaninerRef.current!, {
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
    return () => {
      setBScroll(null);
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if(!bScroll || !onScroll) return;
    bScroll.on('scroll', onScroll)
    return () => {
      bScroll.off('scroll', onScroll);
    }
  }, [onScroll, bScroll]);

  useEffect(() => {
    if(!bScroll || !pullUp) return;
    const handlePullUp = () => {
      //判断是否滑动到了底部
      if(bScroll.y <= bScroll.maxScrollY + 100){
        pullUpDebounce();
      }
    };
    bScroll.on('scrollEnd', handlePullUp);
    return () => {
      bScroll.off('scrollEnd', handlePullUp);
    }
  }, [pullUp, pullUpDebounce, bScroll]);

  useEffect(() => {
    if(!bScroll || !pullDown) return;
    const handlePullDown = (pos: PosData) => {
      //判断用户的下拉动作
      if(pos.y > 50) {
        pullDownDebounce();
      }
    };
    bScroll.on('touchEnd', handlePullDown);
    return () => {
      bScroll.off('touchEnd', handlePullDown);
    }
  }, [pullDown, pullDownDebounce, bScroll]);


  useEffect(() => {
    if(refresh && bScroll){
      bScroll.refresh();
    }
  });

  useImperativeHandle(ref, () => ({
    refresh() {
      if(bScroll) {
        bScroll.refresh();
        bScroll.scrollTo(0, 0);
      }
    },
    getBScroll() {
      if(bScroll) {
        return bScroll;
      }
    }
  }));

  const PullUpdisplayStyle = pullUpLoading ? { display: "" } : { display: "none" };
  const PullDowndisplayStyle = pullDownLoading ? { display: "" } : { display: "none" };
  return (
    <ScrollContainer ref={scrollContaninerRef}>
      {props.children}
      {/* 滑到底部加载动画 */}
      <PullUpLoading style={ PullUpdisplayStyle }><Loading></Loading></PullUpLoading>
      {/* 顶部下拉刷新动画 */}
      <PullDownLoading style={ PullDowndisplayStyle }><Loading2></Loading2></PullDownLoading>
    </ScrollContainer>
  );
})