import { ArticleActionType } from "./actions";

// Начальное состояние товара
const initialState = {
  data: {},
  waiting: false
}

export default function reducer(state: ArticleStateType = initialState, action: ArticleActionType){
  switch (action.type) {

    case "article/load":
      return { ...state, data: {}, waiting: true};

    case "article/load-success":
      return { ...state, data: action.payload.data, waiting: false};

    case "article/load-error":
      return { ...state, data: {}, waiting: false}; //@todo текст ошибки сохранить?

    default:
      // Нет изменений
      return state;
  }
}

// types
export type ArticleStateType = typeof initialState