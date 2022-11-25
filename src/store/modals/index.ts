import StateModule from "@src/store/module";

const initState = {
  modals: [] as CommonModalType[],
}

/**
 * Управление модальными окнами
 */
class ModalsState extends StateModule{

  initState(): ModalsStateType {
    return initState
  }

  /**
   * Добавление модального окна
   * @param popupObj {Object} Объект модалки
   */
  open(popupObj: CommonModalType){
    this.setState({
      ...this.getState(),
      modals: [ 
        ...this.getState().modals, 
        popupObj
      ],
    }, `Открытие модалки ${popupObj.name}`);
  }

  /**
   * Удаление модального окна
   * @param popupObj {Object} Объект модалки
   */
  close(popupObj: CommonModalType){
    this.setState({
      ...this.getState(),
      modals: [ ...this.getState().modals.filter( (m: CommonModalType) => m !== popupObj) ]
    }, `Закрытие модалки ${popupObj.name}`);
  }

  /**
 * Закрытие всех модалок
 */
  closeAll(){
    this.setState({
      ...this.getState(),
      modals: []
    }, `Закрытие всех модалок`);
  }

}

export default ModalsState;

// types
export type ModalsStateType = typeof initState

type RequiredModalType = {
  name: string,
  onClose: () => void,
}

type OptionalModalType = {
  [key: string]: any
}

type CommonModalType = RequiredModalType & OptionalModalType


