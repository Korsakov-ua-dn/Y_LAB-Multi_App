import StateModule from "@src/store/module";

/**
 * Чат
 */
class ChatState extends StateModule {

  /**
   * Начальное состояние
   * @return {Object}
   */
  initState() {
    return {
      messages: [],
      isAuth: false,
      wsStatus:  "pending", // "pending" | "ready" | "error" | "closed"
    };
  }

  /**
   * 
   */
  connect(token) {
    this.services.wsChat.start(token)
    this.services.wsChat.subscribe('messages-received', this._newMessageHandler)
    this.services.wsChat.subscribe('status-changed', this._statusChangedHandler)
  }

  /**
   * 
   */
  disconnect() {
    this.services.wsChat.stop()
    this.setState( this.initState(), ``)
  }

  /**
   * 
   */
  sendMessage(message) {
    this.services.wsChat.sendMessage(message)
  }

  setMessage(message) {
    this.setState({
      ...this.getState(),
      messages: [
        ...this.getState().messages,
        message
      ],
    }, `Добавил сообщение в стейт`);
  }

  _statusChangedHandler = (wsStatus) => {
    console.log("wsStatus BLL: ", wsStatus);

    this.setState({
      ...this.getState(),
      wsStatus,
    }, `WS status changed => ${wsStatus}`)

  }

  _newMessageHandler = (data) => {
    // console.log("BLL _newMessageHandler: ", JSON.stringify(data));
    switch (data.method) {

      case "auth":
        this.setState({
          ...this.getState(),
          isAuth: data.payload.result,
        }, `Результат аутентификации ${data.payload.result}`)
        break;

      case "last":
        this._lastMessageHandler(data)
        break;

      case "old":
        this._oldMessageHandler(data)
        break;

      case "post":
        this._postMessageHandler(data)
        break;
    }

  }

  _sortByDate (arr) {
    return arr.sort((a, b) => {
      let prev = new Date(a.dateCreate).getTime()
      let next = new Date(b.dateCreate).getTime()
      return (
        prev - next
      )
    })
  }

  _removeDuplicates(data, key) {
    return [
      ...new Map(data.map(item => [key(item), item])).values()
    ]
  };

  _lastMessageHandler = (data) => {
    const res = data.payload.items
    // res.shift() // удаляем первый item что бы не задваивался при error
    // const messages = this._sortByDate([...this.getState().messages.concat(res)]) // сортируем

    const unique = this._removeDuplicates([...this.getState().messages.concat(res)], m => m._id) // () => уникальные значения
    const messages = this._sortByDate(unique) // сортируем
    console.log("BLL last messages =======> ", messages);

    setTimeout(() => {
      this.setState({
        ...this.getState(),
        messages,
      }, `Последние сообщения получены`);
    }, 0) 
  }

  _oldMessageHandler = (data) => {
    const res = data.payload.items
    // res.pop() // удаляем последний item что бы не задваивался
    // const messages = this._sortByDate([...this.getState().messages.concat(res)]) // сортируем

    const unique = this._removeDuplicates([...this.getState().messages.concat(res)], m => m._id) // уникальные значения (63447696ee9a8b6444c13f33)
    const messages = this._sortByDate(unique) // сортируем
    console.log("BLL old messages ==============> ", messages);

    this.setState({
      ...this.getState(),
      messages,
    }, `Старые 9 сообщений получены`);

  }

  _postMessageHandler = (data) => {
    const ifExist = this.getState().messages.map(m => m._key === data.payload._key ? data.payload : m)
    const messages = this._sortByDate(ifExist) // сортируем
    // console.log("BLL _postMessageHandler messages: : : ", messages);

    this.setState({
      ...this.getState(),
      messages,
    }, `Последнее сообщение получено`);
  }

}

export default ChatState;
