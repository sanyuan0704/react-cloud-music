import React, {lazy, Suspense} from 'react';
import { Redirect } from "react-router-dom";

const HomeComponent = lazy(() => import("../application/Home/"));
const Home = (props) => {
  return (
    <Suspense fallback={null}>
      <HomeComponent {...props}></HomeComponent>
    </Suspense>
  )
};
 
const RecommendComponent = lazy(() => import("../application/Recommend/"));
const Recommend = (props) => {
  return (
    <Suspense fallback={null}>
      <RecommendComponent {...props}></RecommendComponent>
    </Suspense>
  )
};

const SingersComponent = lazy(() => import("../application/Singers/"));
const Singers = (props) => {
  return (
    <Suspense fallback={null}>
      <SingersComponent {...props}></SingersComponent>
    </Suspense>
  )
};

const RankComponent = lazy(() => import("../application/Rank/"));
const Rank = (props) => {
  return (
    <Suspense fallback={null}>
      <RankComponent {...props}></RankComponent>
    </Suspense>
  )
};

const AlbumComponent = lazy(() => import("../application/Album/"));
const Album = (props) => {
  return (
    <Suspense fallback={null}>
      <AlbumComponent {...props}></AlbumComponent>
    </Suspense>
  )
};

const SingerComponent = lazy(() => import("./../application/Singer/"));
const Singer = (props) => {
  return (
    <Suspense fallback={null}>
      <SingerComponent {...props}></SingerComponent>
    </Suspense>
  )
};

const SearchComponent = lazy(() => import("./../application/Search/"));
const Search = (props) => {
  return (
    <Suspense fallback={null}>
      <SearchComponent {...props}></SearchComponent>
    </Suspense>
  )
};

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
        key: 'home',
        component: Recommend,
        routes:[{
          path: '/recommend/:id',
          component: Album,
        }]
      },
      {
        path: "/singers",
        component: Singers,
        key: 'singers',
        routes: [{
          path: "/singers/:id",
          component: Singer
        }]
      },
      {
        path: "/rank",
        component: Rank,
        key: 'rank',
        routes:[{
          path: '/rank/:id',
          component: Album,
        }]
      },
      {
        path: "/album/:id",
        exact: true,
        key: "album",
        component: Album
      },
      {
        path: "/search",
        exact: true,
        key: "search",
        component: Search
      },
    ]
  },

];
