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
    baseUrl: process.env.NODE_ENV === 'production' ? "http://example.front.ylab.io/api/v1" : ''
  },

  ws: {
    
  },
}

console.log("config: ", process.env.NODE_ENV === 'production');


export default config;

export type RootConfigType = typeof config
export type ApiConfigType = typeof config.api
export type StoreConfigType = typeof config.store
export type WSConfigType = typeof config.ws

