import Store, { ModulesType, RootStateType, StoreModulesType } from ".";
import Services from "../services";

class StateModule {

  services: Services

  /**
   * @param store {Store}
   * @param config {Object}
   */
  constructor(public store: Store, public config: {name: keyof StoreModulesType}) {
    this.services = store.services;
  }

  defaultConfig(){
    return {};
  }

  /**
   * Начальное состояние
   * @return {Object}
   */
  initState(): object {
    return {};
  }

  getState<T extends StateModule>(this: T): StateModulesType<T> {
    return this.store.getState()[this.config.name as keyof ModulesType] as StateModulesType<T>;
  }

  setState<T>(newState: T, description: string = 'setState'){
    this.store.setState({
      ...this.store.getState(),
      [this.config.name]: newState
    }, description)
  }

}

export default StateModule;

// types
type StateModulesType<T extends StateModule> = ReturnType<T['initState']>
