import {  ModalsActionType } from "./actions"

// Начальное состояние для управления модалками
const initialState = {
  name: ''
}

// Обработчик действий в redux
export default function(state: ModalsStateType = initialState, action: ModalsActionType){
  switch (action.type) {
    case "modal/open":
      return { ...state, name: action.payload.name};
    case "modal/close":
      return { ...state, name: null };
    default:
      // Нет изменений
      return state;
  }
}

// types
export type ModalsStateType = typeof initialState
