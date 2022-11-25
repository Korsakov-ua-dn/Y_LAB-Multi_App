import { StoreConfigType } from '@src/config';
import Services from '../services';
import * as modules from './exports';

class Store {

  /**
   * @param services {Services}
   * @param config {Object}
   */
  modules: StoreModulesType
  state: RootStateType
  listeners: (() => void)[]

  constructor(
    // Менеджер сервисов
    public services: Services, 
    public config: StoreConfigType = {log: false, ...config}
  ) {
    // Состояние приложения (данные)
    this.state = {} as RootStateType;
    // Слушатели изменений state
    this.listeners = [];
    
    // Модули
    this.modules = {} as StoreModulesType;
    for (const name of Object.keys(modules)) {
      // Экземпляр модуля. Передаём ему ссылку на store и навзание модуля.
      this.modules[name] = new modules[name](this, {name, ...this.config.modules[name] || {}});
      // По названию модля устанавливается свойство с анчальным состоянием от модуля
      this.state[name] = this.modules[name].initState();
    }
  }

   /**
   * Создает новый модуль состояния из базового. Может использоваться для дублирования логики, но разделения значений
   * @param name Имя нового состояния
   * @param module Имя состояния, которое клонируется
   * @returns {(function(): void)|*} Функция для уничтожения созданного состояния
   */
  createState(name: string, module: keyof StoreModulesType): void {
    this.modules[name] = new modules[module](this, {name: name, ...this.config.modules[module] || {}})
    this.state[name] = this.modules[name].initState();
  }

  deleteState(name: keyof StoreModulesType) {
    delete this.state[name]
    delete this.modules[name]
  }

  /**
   * Доступ к модулю состояния
   * @param name {String} Название модуля
   */
  get<T extends keyof StoreModulesType>(name: T): StoreModulesType[T] {
    return this.modules[name];
  }

  /**
   * Выбор state
   * @return {Object}
   */
  getState(): RootStateType {
    return this.state;
  }

  /**
   * Установка state
   * @param newState {Object}
   * @param [description] {String} Описание действия для логирования
   */
  setState(newState: RootStateType, description: string = 'setState') {
    if (this.config.log) {
      console.group(
        `%c${'store.setState'} %c${description}`,
        `color: ${'#777'}; font-weight: normal`,
        `color: ${'#333'}; font-weight: bold`,
      );
      console.log(`%c${'prev:'}`, `color: ${'#d77332'}`, this.state);
      console.log(`%c${'next:'}`, `color: ${'#2fa827'}`, newState);
      console.groupEnd();
    }
    this.state = newState;
    // Оповещаем всех подписчиков об изменении стейта
    for (const listener of this.listeners) {
      listener();
    }
  }

  /**
   * Подписка на изменение state
   * @param callback {Function}
   * @return {Function} Функция для отписки
   */
  subscribe(callback: () => void): () => void {
    this.listeners.push(callback);
    // Возвращаем функцию для удаления слушателя
    
    return () => {
      this.listeners = this.listeners.filter(item => item !== callback);
    }
  }
}

export default Store;

export type RootStateType = {
  [P in keyof StoreModulesType]: ReturnType<StoreModulesType[P]["initState"]>
}

export type ModulesType = typeof modules
export type StoreModulesType = {
  [P in keyof ModulesType]: InstanceType<ModulesType[P]>
}

// export type IState<T extends StateModule> = ReturnType<T['initState']>

