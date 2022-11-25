import Store from "./store";
import APIService from "./api";
import WSService from "./ws";
import createStoreRedux, { StoreReduxType } from "./store-redux";
import { RootConfigType } from "./config";

class Services {

  _store: Store
  _api: any
  _ws: any
  _storeRedux: StoreReduxType

  constructor(public config: RootConfigType) {}

  /**
   * Сервис Store
   * @returns {Store}
   */
  get store(): Store{
    if (!this._store) {
      this._store = new Store(this, this.config.store);
    }
    return this._store;
  }

  /**
   * Сервис АПИ
   * @returns {APIService}
   */
  get api(){
    if (!this._api) {
      this._api = new APIService(this, this.config.api);
    }
    return this._api;
  }

  /**
   * Сервис WS
   * @returns {WSService}
   */
    get wsChat(){
    if (!this._ws) {
      this._ws = new WSService(this, this.config.ws);
    }
    return this._ws;
  }

  /**
   * Redux store
   */
  get storeRedux(): StoreReduxType{
    if (!this._storeRedux) {
      this._storeRedux = createStoreRedux(this, this.config.storeRedux);
    }
    return this._storeRedux;
  }
}

export default Services;