import {ThunkAction} from 'redux-thunk';
import { RootReduxActionsType, RootReduxState } from '..';

export default {

  load: (_id: string): ThunkTypes => {
    return async(dispatch, getState, services: any) => {
      dispatch(load())

      try {
        const json = await services.api.request({url: `/api/v1/articles/${_id}?fields=*,maidIn(title,code),category(title)`});
        // Товар загружен успешно
        
        dispatch(loadSucces({data: json.result}));

      } catch (e){
        // Ошибка при загрузке
        dispatch(loadError());
      }
    }
  },
}

// actions
const load = () => ({type: 'article/load'} as const)
const loadSucces = (payload: ArticleType) => ({type: 'article/load-success', payload} as const)
const loadError = () => ({type: 'article/load-error'} as const)

// types
export type ArticleActionType = ReturnType<typeof load> 
  |  ReturnType<typeof loadSucces>
  |  ReturnType<typeof loadError> 

export type ThunkTypes<ReturnType = void> = ThunkAction<ReturnType,
  RootReduxState,
  unknown,
  RootReduxActionsType>


type MaidIn = {
  title: string;
  code: string;
  _id: string;
}

type Category = {
  title: string;
  _id: string;
}

type Result = {
  _id: string;
  _key: string;
  name: string;
  title: string;
  description: string;
  price: number;
  maidIn: MaidIn;
  edition: number;
  category: Category;
  order: number;
  isNew: boolean;
  _type: string;
  dateCreate: Date;
  dateUpdate: Date;
  isDeleted: boolean;
  isFavorite: boolean;
}

type ArticleType = {
  data: Result;
}
