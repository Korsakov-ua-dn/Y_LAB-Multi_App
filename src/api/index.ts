import { ApiConfigType } from "@src/config";
import Services from "@src/services";

class APIService {
  defaultHeaders: {}

  /**
   * @param services {Services} Менеджер сервисов
   * @param config {Object}
   */
  constructor(public services: Services, public config: ApiConfigType) {
    // this.services = services;
    // this.config = {
    //   baseUrl: '',
    //   ...config
    // }
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    }
    
  }

  /**
   * HTTP запрос
   * @param url
   * @param method
   * @param headers
   * @param options
   * @returns {Promise<any>}
   */
  async request({url, method = 'GET', headers = {}, ...options}): Promise<any> {
    // if (!url.match(/^(http|\/\/)/)) url = this.config.baseUrl + url;
    // console.log("url: ", this.config.baseUrl);
    
    const res = await fetch("http://example.front.ylab.io" + url, {
      method,
      headers: {...this.defaultHeaders, ...headers},
      ...options,
    });
    return res.json();
  }

  /**
   * Установка или сброс заголовка
   * @param name {String} Название заголвока
   * @param value {String|null} Значение загововка
   */
  setHeader(name: string, value: string | null = null) {
    if (value) {
      this.defaultHeaders[name] = value;
    } else if (this.defaultHeaders[name]) {
      delete this.defaultHeaders[name];
    }
  }
}

export default APIService;
