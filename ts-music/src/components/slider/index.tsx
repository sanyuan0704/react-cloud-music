import React, { useEffect, useState } from 'react';
import { SliderContainer } from './style';
import "swiper/dist/css/swiper.css";
import Swiper from "swiper";
import { IBannerList } from '../../application/Recommend/store/reducer';

interface ISliderProp {
  bannerList: IBannerList;
}

const Slider = (props: ISliderProp) => {
  const [sliderSwiper, setSliderSwiper] = useState<Swiper | null>(null);
  const { bannerList } = props;

  useEffect(() => {
    if(bannerList.length && !sliderSwiper){
        const sliderSwiper = new Swiper(".slider-container", {
          loop: true,
          autoplay: {
            delay: 3000,
            disableOnInteraction: false,
          },
          pagination: {el: '.swiper-pagination'},
        });
        console.log();
        setSliderSwiper(sliderSwiper);
    }
  }, [bannerList.length, sliderSwiper])
  return (
    <SliderContainer>
      <div className="before"></div>
      <div className="slider-container">
        <div className="swiper-wrapper">
          {
            bannerList.map(slider => {
              return (
                <div className="swiper-slide" key={slider.imageUrl}>
                  <div className="slider-nav">
                    <img src={slider.imageUrl} width="100%" height="100%" alt="推荐" />
                  </div>
                </div>
              );
            })
          }
        </div>
        <div className="swiper-pagination"></div>
      </div> 
    </SliderContainer>
  );
}


export default React.memo(Slider);