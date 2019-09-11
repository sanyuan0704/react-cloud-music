import React from 'react';
import { Redirect } from "react-router-dom";
import Recommend from '../application/Recommend';
import Singers from '../application/Singers';
import Rank from '../application/Rank';
import Home from '../application/Home';
import Album from '../application/Album';

export default [
  {
    path: "/",
    component: Home,
    routes: [
      {
        path: "/",
        exact: true,
        render: () => (
          <Redirect to={"/recommend"}/>
        )
      },
      {
        path: "/recommend/",
        component: Recommend,
        routes: [
          {
            path: "/recommend/:id",
            component: Album
          }
        ]
      },
      {
        path: "/singers",
        component: Singers
      },
      {
        path: "/rank/",
        component: Rank,
        key: "rank",
        routes: [
          {
            path: "/rank/:id",
            component: Album
          }
        ]
      },
    ]
  }
]