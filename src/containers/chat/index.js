import React, {useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";
import useTranslate from "@src/hooks/use-translate";
import useSelector from "@src/hooks/use-selector";
import useStore from "@src/hooks/use-store";
import Message from "@src/components/elements/message";
import ChatList from "@src/components/chat-list";
import { v1 } from "uuid";

function Chat() {

  const {t} = useTranslate();
  const store = useStore();

  const select = useSelector(state => ({
    messages: state.chat.messages,
    wsStatus: state.chat.wsStatus,
    userId: state.session.user._id,
    username: state.session.user.profile.name,
  }))

  const bottomRef = useRef();
  const currentRef = useRef();
  const [scrollToCurrent, setScrollToCurrent] = useState(null);
  const [firstItem, setFirstItem] = useState();
  const [isAutoscroll, setAutoscroll] = useState(true);

  const callbacks = {

    // Отправить сообщение
    send: useCallback((text) => {
      const _key = v1();
      const message = {
        method: 'post',
        _key,
        author: {
          _id: select.userId,
          profile: {name: select.username}
        },
        text,
      }
      store.get('chat').setMessage(message)

      const request = {
        method: 'post',
        payload: {
          _key,
          text,
        }
      }
      store.get('chat').sendMessage(request)
      setAutoscroll(true) // after send scroll to bottom
    }, [select.userId, select.username]),

    // Обработка скролла
    onScroll: useCallback((e) => { 
      const element = e.currentTarget;
      if (element.scrollTop === 0) {
        const oldMessage = {
          method: 'old',
          payload: {
            fromId: select.messages[0]._id
          }
        }
        // console.log("onscroll first id: : : : : ", select.messages[0]._id);
        store.get('chat').sendMessage(oldMessage)
      }

      if (Math.abs((element.scrollHeight - element.scrollTop) - element.clientHeight) < 70) {
        setAutoscroll(true)
      } else {
        setAutoscroll(false)
      }
    }, [select.messages.length]),
  };

  // нахожу дату последнего полученного с сервера сообщения
  const findLastDate = useMemo(() => {
    if (select.wsStatus === 'closed') {
      let lastDate;
      for (let i = 1; i >= 0; i++) {
        if (select.messages[select.messages.length - i].dateCreate) {
          lastDate = select.messages[select.messages.length - i].dateCreate
          break;
        }
      }
      return lastDate
    }
  }, [select.messages.length, select.wsStatus])

  const renders = {
    message: useCallback((m, i) => {
      return <Message ref={i == 0 ? currentRef : null} key={m._id || v1()} m={m} my={m.author._id === select.userId}/>
    }, [select.userId, currentRef]),
  }

  // подгрузить последние 9 сообщений
  useLayoutEffect(() => {
    const message = {
      method: 'last',
      payload: {}
    }
    store.get('chat').sendMessage(message)

    // Пингую сервер для предотвращения разрыва соединения WS
    let intervalPing = setInterval(() => store.get('chat').sendMessage('ping'), 50000)
    return () => clearInterval(intervalPing) 
  }, [])

  // подгрузить последние если произошла ошибка соединения
  useLayoutEffect(() => {
    console.log("wsStatus =================> ", select.wsStatus);
    if (select.wsStatus === 'closed') {
      const message = {
        method: 'last',
        payload: {
          fromDate: findLastDate,
        }
      }
      store.get('chat').sendMessage(message)
    }
  }, [findLastDate, select.wsStatus])

  // Авторскролл к новым сообщениям
  useEffect(() => {
    isAutoscroll && bottomRef.current?.scrollIntoView({behavior: 'smooth'})
  })

  // Autoscroll to current after send "old"
  useLayoutEffect(() => {
    if (select.messages[0] !== firstItem) {
      setScrollToCurrent(prev => {
        prev?.scrollIntoView()
        return (
          currentRef.current
        )
      })
    }
    setFirstItem(select.messages[0])
  }, [select.messages.length])

  return (
    <ChatList ref={bottomRef}
              renderFunc={renders.message}
              send={callbacks.send}
              onScroll={callbacks.onScroll}
              messages={select.messages}
              />
  );
}

export default React.memo(Chat);


