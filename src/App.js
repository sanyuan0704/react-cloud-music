import React from 'react'
import { Provider } from 'react-redux'
import { GlobalStyle } from  './style'
import { renderRoutes } from 'react-router-config'
import { IconStyle } from './assets/iconfont/iconfont'
import store from './store/index'
import routes from './routes/index.js'
import { BrowserRouter } from 'react-router-dom';
import './fix.css';
import { Provider as KeepAliveProvider } from 'react-keep-alive';

function App() {
  return (
    <Provider store={store}>
      <KeepAliveProvider>
        <BrowserRouter>
            <GlobalStyle></GlobalStyle>
            <IconStyle></IconStyle>
            { renderRoutes(routes) }
          </BrowserRouter>
      </KeepAliveProvider>
    </Provider>
  )
}

export default App;
