/**
 * Настройки сервисов
 */
const config = {
  store: {
    log: false,

    modules: {
      session: {
        tokenHeader: 'X-Token'
      }
    }
  },

  storeRedux: {},

  api: {
    baseUrl: ''
  },

  ws: {
    
  },
}

export default config;

export type RootConfigType = typeof config
export type ApiConfigType = typeof config.api
export type StoreConfigType = typeof config.store
export type WSConfigType = typeof config.ws

