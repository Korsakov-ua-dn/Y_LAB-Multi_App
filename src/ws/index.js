
class WSService {

  constructor(services, config) {
    this.services = services;
    this.subscribers = {
      'messages-received': [],
      'status-changed': [],
    };
    this.ws = null;
    this.needsSending = [];
  }

  /**
   * WS
   */
  start (token) {
    this._createChannel(token)
  }

  /**
   * WS
   */
  stop () {
    this.subscribers['messages-received'] = []
    this.subscribers['status-changed'] = []
    this._removeAllEventListener()
    this.ws?.close()
  }

  /**
   * WS 
   * @param eventName: 'messages-received' | 'status-changed'
   * @param callback: (messages) => void
   */
  subscribe (eventName, callback) {
    this.subscribers[eventName].push(callback)
  }
  
  /**
   * WS
   * @param eventName: 'messages-received' | 'status-changed'
   * @param callback: (messages) => void
   */
  unsubscribe (eventName, callback) {
    this.subscribers[eventName] = this.subscribers[eventName].filter(s => s !== callback)
  } // not use

  /**
   * WS
   * @param message: Object
   */
  sendMessage (message) {
    // Пушим все сообщения в требуют отправки (ping сюда не попадает) Если offline то после восстановления соединения будет переотправлены
    message.method && this.needsSending.push(message)
    console.log("WS needsSending at sendMessage: ", this.needsSending);
    const json = JSON.stringify(message)
    this.ws?.send(json)
  }

  
  /**
   */
   _createChannel = (token) => {
    console.log("WS _createChannel");
    this.ws = new WebSocket('ws://example.front.ylab.io/chat')
    this._addAllEventListener(token)
  }

  _addAllEventListener (token) {
    this.ws.addEventListener('close', (e) => this._closeHandler(e, token))
    this.ws.addEventListener('message', this._messageHandler)
    this.ws.addEventListener('open', () => this._openHandler(token))
    this.ws.addEventListener('error', this._errorHandler)
  }

  _removeAllEventListener () {
    this.ws?.removeEventListener('close', this._closeHandler)
    this.ws?.removeEventListener('message', this._messageHandler)
    this.ws?.removeEventListener('open', this._openHandler)
    this.ws?.removeEventListener('error', this._errorHandler)
  }

// Handlers
  _closeHandler = (e ,token) => {
    console.log("WS _closeHandler");
    this._removeAllEventListener()
    if (!e.wasClean) {
      console.log("Восстановление");
      this.subscribers['status-changed'].forEach(s => s('closed'))
      setTimeout(() => this._createChannel(token), 3000)
    }
  }
  
  _openHandler = (token) => {
    console.log("WS _openHandler");
    const res = JSON.stringify({
      method: 'auth',
      payload: { token }
    })
    this.ws.send(res)
    
    this.subscribers['status-changed'].forEach(s => s('ready'))
  }

  _messageHandler = (e) => {
    console.log("WS _messageHandler")
    const newMessages = JSON.parse(e.data)
    // после аутентификации необходимо отправить все не отправленные сообщения
    if (newMessages.method === 'auth') {
      this.needsSending.forEach(m => {
        const json = JSON.stringify(m)
        this.ws?.send(json)
      })
    }
    // Удаляеям по _key сообщения из требуют отправки, "last" не содержит _key и удаляется потому что underfind === underfind
    this.needsSending = this.needsSending.filter(m => m.payload._key !== newMessages.payload._key)
    console.log("this.needsSending: ", this.needsSending);
    this.subscribers['messages-received'].forEach(s => s(newMessages))
  }

  _errorHandler = (e) => {
    console.log("WS _errorHandler");
    // this.subscribers['status-changed'].forEach(s => s('error'))
  }

}

export default WSService;

