import React from 'react';
import {render} from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, compose, applyMiddleware, combineReducers } from 'redux';
import { promiseMiddleware, chainMiddleware, dictionary_reducers } from 'redux-redents';
import dataEntities from './entities';
import Fruits from './fruits';
import "babel-polyfill";

import './styles/styles.scss'; //Yep, that's right. You can import SASS/CSS files too! Webpack will run the associated loader and plug this into the page.

createRootReducer = () => {
  const dicts = dictionary_reducers(dataEntities.entities);
  return combineReducers({...dicts});
}

configureStore = (rootReducer) => {
  return applyMiddleware(promiseMiddleware,chainMiddleware)(createStore)(rootReducer, initialState,compose(
    // Add other middleware on this line...
    window.devToolsExtension ? window.devToolsExtension() : f => f //add support for Redux dev tools
    )
  );
}



const store = configureStore(createRootReducer());


render(
  <Provider store={store}>
    <Fruits/>
    </Provider>, document.getElementById('app')
    );
