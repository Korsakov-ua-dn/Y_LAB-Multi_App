import Services from '../services.js';
import {createStore, combineReducers, applyMiddleware} from "redux";
import thunk from 'redux-thunk';
import { ArticleActionType } from "./article/actions";
import * as reducers from './exports';
import { ModalsActionType } from "./modals/actions";

let rootReducer;

export default function createStoreRedux(services: Services, config){
  rootReducer = createStore(combineReducers(reducers), undefined, applyMiddleware(
    thunk.withExtraArgument(services)
  ));
  return rootReducer
}

export type RootReduxActionsType = ModalsActionType | ArticleActionType
export type RootReduxState = ReturnType<typeof rootReducer>
export type StoreReduxType = ReturnType<typeof createStoreRedux>